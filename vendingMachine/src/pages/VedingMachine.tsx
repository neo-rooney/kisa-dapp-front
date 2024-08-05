import { VendingMachineArtifacts } from "@/abi/VendingMachine";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { VENDING_MACHINE_CA } from "@/constants";
import { useWalletContext } from "@/contexts/WalletContext/WalletContext";
import { Label } from "@radix-ui/react-label";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

const VendingMachinePage = () => {
  const { selectedWallet, selectedAccount } = useWalletContext();
  const [contract, setContract] = useState<ethers.Contract>();
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [owner, setIsOwner] = useState(false);
  useEffect(() => {
    async function load() {
      try {
        if (!selectedWallet) return;

        const provider = new ethers.BrowserProvider(selectedWallet?.provider);
        const signer = await provider.getSigner();

        const abi = VendingMachineArtifacts.abi;

        const VendingMachineContract = new ethers.Contract(
          VENDING_MACHINE_CA,
          abi,
          signer
        );

        setContract(VendingMachineContract);

        const balance = await VendingMachineContract.cupcakeBalances(
          VENDING_MACHINE_CA
        );

        setBalance(Number(balance));

        const owner = await VendingMachineContract.owner();
        setIsOwner(
          ethers.getAddress(owner) === ethers.getAddress(selectedAccount!)
        );
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, [selectedWallet]);

  const handleClickBuy = async () => {
    if (!amount) return;
    try {
      const ethValueInHex = ethers.parseUnits(amount, "ether").toString(16);

      const provider = selectedWallet?.provider;

      if (!provider) return;
      const transferCalldata = contract?.interface.encodeFunctionData(
        "purchase",
        [amount]
      );
      const signedTx = await provider.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: selectedAccount,
            to: VENDING_MACHINE_CA,
            value: ethValueInHex,
            data: transferCalldata,
            // Customizable by the user during MetaMask confirmation.
            gasLimit: "0x5028",
            // Customizable by the user during MetaMask confirmation.
            maxPriorityFeePerGas: "0x3b9aca00",
            // Customizable by the user during MetaMask confirmation.
            maxFeePerGas: "0x2540be400",
          },
        ],
      });

      const txResult = (await provider.request({
        method: "eth_getTransactionReceipt",
        params: [signedTx],
      })) as TransactionReceipt;

      console.log(txResult);

      if (txResult.status === "0x1") {
        console.log("트랜잭션이 성공적으로 처리되었습니다.");
        setAmount("");
        // 재시도 메커니즘을 통해 상태 확인
        const maxAttempts = 10; // 최대 재시도 횟수
        const delay = 1000; // 1초 대기
        let attempts = 0;
        let updated = false;
        while (!updated && attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          const newBalance = await contract?.cupcakeBalances(
            VENDING_MACHINE_CA
          );
          if (Number(newBalance) !== balance) {
            setBalance(Number(newBalance));
            updated = true;
          } else {
            attempts++;
            console.log(`재시도 중... (${attempts}/${maxAttempts})`);
          }
        }

        if (!updated) {
          console.warn("스마트 계약 상태가 예상대로 업데이트되지 않았습니다.");
        }
      } else {
        console.error("트랜잭션 실패");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleClickRefill = async () => {
    const amount = "100";

    const provider = selectedWallet?.provider;

    if (!provider) return;
    const transferCalldata = contract?.interface.encodeFunctionData("refill", [
      amount,
    ]);

    const signedTx = await provider.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: selectedAccount,
          to: VENDING_MACHINE_CA,
          data: transferCalldata,
          // Customizable by the user during MetaMask confirmation.
          gasLimit: "0x5028",
          // Customizable by the user during MetaMask confirmation.
          maxPriorityFeePerGas: "0x3b9aca00",
          // Customizable by the user during MetaMask confirmation.
          maxFeePerGas: "0x2540be400",
        },
      ],
    });

    const txResult = (await provider.request({
      method: "eth_getTransactionReceipt",
      params: [signedTx],
    })) as TransactionReceipt;

    console.log(txResult);

    if (txResult.status === "0x1") {
      console.log("트랜잭션이 성공적으로 처리되었습니다.");
      setAmount("");
      // 재시도 메커니즘을 통해 상태 확인
      const maxAttempts = 10; // 최대 재시도 횟수
      const delay = 1000; // 1초 대기
      let attempts = 0;
      let updated = false;
      while (!updated && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        const newBalance = await contract?.cupcakeBalances(VENDING_MACHINE_CA);
        if (Number(newBalance) !== balance) {
          setBalance(Number(newBalance));
          updated = true;
        } else {
          attempts++;
          console.log(`재시도 중... (${attempts}/${maxAttempts})`);
        }
      }

      if (!updated) {
        console.warn("스마트 계약 상태가 예상대로 업데이트되지 않았습니다.");
      }
    } else {
      console.error("트랜잭션 실패");
    }
  };

  return (
    <main className="w-full h-dvh flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">컵 케이크 머신</CardTitle>
          <CardDescription>지갑을 연결해주세요.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">남은 컵 케이크 개수</Label>
            <Input id="amount" disabled value={balance} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">구매할 컵 케이크 수량을 입력해주세요.</Label>
            <Input
              id="amount"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button className="w-full" onClick={handleClickBuy}>
            구매하기
          </Button>
          {owner && (
            <Button
              className="w-full"
              onClick={handleClickRefill}
              variant="outline"
            >
              100개 리필하기
            </Button>
          )}
        </CardFooter>
      </Card>
    </main>
  );
};

export default VendingMachinePage;
