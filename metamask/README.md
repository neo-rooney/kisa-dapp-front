#### 1. Vite 기반 React 프로젝트 세팅

- [참고 문서](https://vitejs.dev/guide/)

```shell
npm create vite@latest metamask -- --template react-ts

cd metamask

npm install

npm run dev
```

![image](https://github.com/user-attachments/assets/1cbe2b96-c716-4674-8f94-2300f718ba01)

#### 2. shadcn/ui 설치

- [공식 문서 ](https://ui.shadcn.com/docs/installation/vite)

#### 3. 지갑 연결 화면 퍼블리싱

```
npx shadcn-ui@latest add card avatar button
```

- components/MetamaskConnector

```tsx title=components/MetamaskConnector
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function MetamaskConnector() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">지갑 연결</CardTitle>
        <CardDescription>지갑을 연결해주세요.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage src="/avatars/03.png" alt="Avatar" />
            <AvatarFallback>IN</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">Metamask</p>
            <p className="text-sm text-muted-foreground">
              0x0000000000000000000000
            </p>
          </div>
          <div className="ml-auto font-medium">
            <Button variant="outline">연결</Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage src="/avatars/03.png" alt="Avatar" />
            <AvatarFallback>IN</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">Phantom</p>
            <p className="text-sm text-muted-foreground">
              0x0000000000000000000000
            </p>
          </div>
          <div className="ml-auto font-medium">
            <Button variant="outline">연결</Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled>
          로그인
        </Button>
      </CardFooter>
    </Card>
  );
}
```

![image](https://github.com/user-attachments/assets/6e82a12b-a73f-481a-8b95-e32b1e004582)

#### 4. WalletConext 작성

##### (1) EIP-6963 interfaces

###### 1) EIP-6963이란

- 기존의 브라우저 기반 지갑 감지 메커니즘은 `window.ethereum` 객체를 통해 주입된 공급자를 이용했는데, 이 방식은 브라우저에서 하나의 지갑만을 감지하는 데 적합
- 여러 지갑이 설치되어 있는 경우 각 지갑이 충돌하거나 사용자가 선호하는 지갑을 선택하기 어려운 문제가 발생
- EIP-6963은 dApp이 브라우저 환경에서 여러 지갑을 감지하고, 사용자가 선호하는 지갑을 선택하거나 사용할 수 있게 해주는 표준

###### 2) EIP-6963 interfaces 전역 types로 선언

- vite-env.d.ts

```ts title=vite-env.d.ts
/// <reference types="vite/client" />

// Describes metadata related to a provider based on EIP-6963.
interface EIP6963ProviderInfo {
  rdns: string;
  uuid: string;
  name: string;
  icon: string;
}

// Represents the structure of a provider based on EIP-1193.
interface EIP1193Provider {
  isStatus?: boolean;
  host?: string;
  path?: string;
  sendAsync?: (
    request: { method: string; params?: Array<unknown> },
    callback: (error: Error | null, response: unknown) => void
  ) => void;
  send?: (
    request: { method: string; params?: Array<unknown> },
    callback: (error: Error | null, response: unknown) => void
  ) => void;
  request: (request: {
    method: string;
    params?: Array<unknown>;
  }) => Promise<unknown>;
}

// Combines the provider's metadata with an actual provider object, creating a complete picture of a
// wallet provider at a glance.
interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: EIP1193Provider;
}

// Represents the structure of an event dispatched by a wallet to announce its presence based on EIP-6963.
type EIP6963AnnounceProviderEvent = {
  detail: {
    info: EIP6963ProviderInfo;
    provider: Readonly<EIP1193Provider>;
  };
};

// An error object with optional properties, commonly encountered when handling eth_requestAccounts errors.
interface WalletError {
  code?: string;
  message?: string;
}
```

##### (2) WalletContext 작성

###### 1) WalletContext.types.ts

```ts title=contexts/WalletContext.types.ts
declare global {
  interface WindowEventMap {
    "eip6963:announceProvider": CustomEvent;
  }
}

export type SelectedAccountByWallet = Record<string, string | null>;

export interface IWalletContext {
  wallets: Record<string, EIP6963ProviderDetail>; // A list of wallets.
  selectedWallet: EIP6963ProviderDetail | null; // The selected wallet.
  selectedAccount: string | null; // The selected account address.
  errorMessage: string | null; // An error message.
  connectWallet: (walletUuid: string) => Promise<void>; // Function to connect wallets.
  disconnectWallet: () => void; // Function to disconnect wallets.
  clearError: () => void;
}
```

###### 2) WallectContext.tsx

```tsx title=contexts/WalletConext.types.ts
import {
  IWalletContext,
  SelectedAccountByWallet,
} from "@/contexts/WalletContext/WalletContext.types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const WalletContext = createContext<IWalletContext | undefined>(undefined);

export function WalletContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [wallets, setWallets] = useState<Record<string, EIP6963ProviderDetail>>(
    {}
  );
  const [selectedWalletRdns, setSelectedWalletRdns] = useState<string | null>(
    null
  );
  const [selectedAccountByWalletRdns, setSelectedAccountByWalletRdns] =
    useState<SelectedAccountByWallet>({});

  const [errorMessage, setErrorMessage] = useState("");

  const clearError = () => setErrorMessage("");
  const setError = (error: string) => setErrorMessage(error);

  useEffect(() => {
    const savedSelectedWalletRdns = localStorage.getItem("selectedWalletRdns");
    const savedSelectedAccountByWalletRdns = localStorage.getItem(
      "selectedAccountByWalletRdns"
    );

    if (savedSelectedAccountByWalletRdns) {
      setSelectedAccountByWalletRdns(
        JSON.parse(savedSelectedAccountByWalletRdns)
      );
    }

    function onAnnouncement(event: EIP6963AnnounceProviderEvent) {
      setWallets((currentWallets) => ({
        ...currentWallets,
        [event.detail.info.rdns]: event.detail,
      }));

      if (
        savedSelectedWalletRdns &&
        event.detail.info.rdns === savedSelectedWalletRdns
      ) {
        setSelectedWalletRdns(savedSelectedWalletRdns);
      }
    }

    window.addEventListener("eip6963:announceProvider", onAnnouncement);
    window.dispatchEvent(new Event("eip6963:requestProvider"));

    return () =>
      window.removeEventListener("eip6963:announceProvider", onAnnouncement);
  }, []);

  const connectWallet = useCallback(
    async (walletRdns: string) => {
      try {
        const wallet = wallets[walletRdns];
        const accounts = (await wallet.provider.request({
          method: "eth_requestAccounts",
        })) as string[];

        if (accounts?.[0]) {
          setSelectedWalletRdns(wallet.info.rdns);
          setSelectedAccountByWalletRdns((currentAccounts) => ({
            ...currentAccounts,
            [wallet.info.rdns]: accounts[0],
          }));

          localStorage.setItem("selectedWalletRdns", wallet.info.rdns);
          localStorage.setItem(
            "selectedAccountByWalletRdns",
            JSON.stringify({
              ...selectedAccountByWalletRdns,
              [wallet.info.rdns]: accounts[0],
            })
          );
        }
      } catch (error) {
        console.error("Failed to connect to provider:", error);
        const walletError: WalletError = error as WalletError;
        setError(
          `Code: ${walletError.code} \nError Message: ${walletError.message}`
        );
      }
    },
    [wallets, selectedAccountByWalletRdns]
  );

  const disconnectWallet = useCallback(async () => {
    if (selectedWalletRdns) {
      setSelectedAccountByWalletRdns((currentAccounts) => ({
        ...currentAccounts,
        [selectedWalletRdns]: null,
      }));

      const wallet = wallets[selectedWalletRdns];
      setSelectedWalletRdns(null);
      localStorage.removeItem("selectedWalletRdns");

      try {
        await wallet.provider.request({
          method: "wallet_revokePermissions",
          params: [{ eth_accounts: {} }],
        });
      } catch (error) {
        console.error("Failed to revoke permissions:", error);
      }
    }
  }, [selectedWalletRdns, wallets]);

  const contextValue: IWalletContext = {
    wallets,
    selectedWallet:
      selectedWalletRdns === null ? null : wallets[selectedWalletRdns],
    selectedAccount:
      selectedWalletRdns === null
        ? null
        : selectedAccountByWalletRdns[selectedWalletRdns],
    errorMessage,
    connectWallet,
    disconnectWallet,
    clearError,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error(
      "useWalletContext must be used within a WalletContextProvider"
    );
  }
  return context;
};
```

##### (3) WalletContext 사용하기

###### 1) App.tsx 수정

```tsx title=app.tsx
import { MetamaskConnector } from "@/components/MetamaskConnector";
import styles from "./App.module.css";
import { WalletContextProvider } from "@/contexts/WalletContext/WalletContext";

function App() {
  return (
    <WalletContextProvider>
      <main className={styles.container}>
        <MetamaskConnector />
      </main>
    </WalletContextProvider>
  );
}

export default App;
```

###### 2) MetamaskConnector.tsx 수정

```tsx title=components/MetamaskConnector.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWalletContext } from "@/contexts/WalletContext/WalletContext";
import { formatAddress } from "@/lib/utils";

export function MetamaskConnector() {
  const {
    wallets,
    connectWallet,
    selectedAccount,
    selectedWallet,
    disconnectWallet,
  } = useWalletContext();

  console.log(selectedWallet);
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">지갑 연결</CardTitle>
        <CardDescription>지갑을 연결해주세요.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {Object.keys(wallets).length > 0 ? (
          Object.values(wallets).map((provider: EIP6963ProviderDetail) => (
            <div className="flex items-center gap-4" key={provider.info.uuid}>
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src={provider.info.icon} alt="Avatar" />
                <AvatarFallback>IN</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  {provider.info.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedWallet?.info.name === provider.info.name &&
                  selectedAccount
                    ? formatAddress(selectedAccount)
                    : "연결되지 않음"}
                </p>
              </div>
              <div className="ml-auto font-medium">
                {selectedWallet?.info.name !== provider.info.name ? (
                  <Button
                    variant="outline"
                    onClick={() => connectWallet(provider.info.rdns)}
                  >
                    연결
                  </Button>
                ) : (
                  <Button variant="outline" onClick={disconnectWallet}>
                    연결 해제
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div>there are no Announced Providers</div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled={!selectedAccount}>
          로그인
        </Button>
      </CardFooter>
    </Card>
  );
}
```

#### 5. Metamask 로그인 구현

- contexts/WalletContext.tsx

```tsx title contexts/WalletContext.tsx
const siweSign = async () => {
  try {
    if (!selectedWalletRdns) return;
    const provider = wallets[selectedWalletRdns].provider;
    const domain = window.location.host;
    const from = selectedAccountByWalletRdns[selectedWalletRdns];
    const siweMessage = `${domain} wants you to sign in with your Ethereum account:\n${from}\n\nI accept the MetaMask Terms of Service: https://community.metamask.io/tos\n\nURI: https://${domain}\nVersion: 1\nChain ID: 1\nNonce: 32891757\nIssued At: 2021-09-30T16:25:24.000Z`;
    const msg = `0x${Buffer.from(siweMessage, "utf8").toString("hex")}`;
    const sign = await provider.request({
      method: "personal_sign",
      params: [msg, from],
    });
    console.log(sign);
  } catch (err) {
    console.error(err);
  }
};
```
