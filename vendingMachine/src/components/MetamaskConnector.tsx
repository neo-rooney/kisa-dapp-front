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
    siweSign,
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
        <Button
          className="w-full"
          disabled={!selectedAccount}
          onClick={siweSign}
        >
          로그인
        </Button>
      </CardFooter>
    </Card>
  );
}
