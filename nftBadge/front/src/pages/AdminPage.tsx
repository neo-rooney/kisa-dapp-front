import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HistoryList } from "@/components/HistoryList";
import { HistoryDetail } from "@/components/HistoryDetail";
import { useWalletContext } from "@/contexts/WalletContext/WalletContext";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { NftArtifacts } from "@/abi/Nft";
import { NFT_CA } from "@/constants";

export type THistory = {
  from: string;
  to: string;
  tokenId: string;
  status: "retrieved" | "granted";
  gasUsed: string;
  gasPrice: string;
  date: string;
  transactionHash: string;
  transactionFee: string;
  blockNumber: string;
};

const AdminPage = () => {
  const { selectedWallet, selectedAccount } = useWalletContext();
  const [contract, setContract] = useState<ethers.Contract>();
  const [receiver, setReceiver] = useState("");
  const [history, setHistory] = useState<THistory[]>([]);
  const [historyDetail, setHistoryDetail] = useState<THistory | null>(null);

  useEffect(() => {
    async function load() {
      try {
        if (!selectedWallet) return;

        const provider = new ethers.BrowserProvider(selectedWallet?.provider);
        const signer = await provider.getSigner();

        const abi = NftArtifacts.abi;

        const NftContract = new ethers.Contract(NFT_CA, abi, signer);
        setContract(NftContract);

        const adminRole = await NftContract.DEFAULT_ADMIN_ROLE();
        const isAdmin = await NftContract.hasRole(adminRole, selectedAccount);
        if (!isAdmin) {
          alert("관리자가 아닙니다!");
        }
        await fetchLog(NftContract);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, [selectedWallet]);

  const grantNftBadge = async () => {
    const provider = selectedWallet?.provider;
    if (!provider || !contract) return;
    const tx = await contract.mint(receiver);

    const receipt = await tx.wait();
    console.log("Transaction mined:", receipt);
    console.log("NFT granted to", receiver);
  };

  const fetchLog = async (contract: ethers.Contract) => {
    if (!selectedWallet) return;
    const provider = new ethers.BrowserProvider(selectedWallet?.provider);
    const filter = contract.filters.Transfer(null, null); // 모든 `from` 및 `to` 주소에 대해 필터링
    const currentBlock = await provider.getBlockNumber();

    const logs = await contract.queryFilter(filter, 6400000, currentBlock);

    const parsedLogs = await Promise.all(
      logs.map(async (log) => {
        const eventLog = log as ethers.EventLog;
        const txReceipt = await provider.getTransactionReceipt(
          eventLog.transactionHash
        );
        const tx = await provider.getTransaction(eventLog.transactionHash);

        if (!tx) {
          throw new Error(
            `Transaction not found for hash: ${eventLog.transactionHash}`
          );
        }

        const blockNumber = tx.blockNumber;
        if (blockNumber === null) {
          throw new Error(
            `Block number not found for transaction: ${eventLog.transactionHash}`
          );
        }

        const block = await provider.getBlock(blockNumber);
        if (!block) {
          throw new Error(`Block not found for number: ${blockNumber}`);
        }

        const status: "retrieved" | "granted" =
          eventLog.args?.[1] === ethers.ZeroAddress ? "retrieved" : "granted";

        const transactionFee =
          txReceipt?.gasUsed && tx?.gasPrice
            ? ethers.formatEther(txReceipt.gasUsed * tx.gasPrice)
            : "0";

        return {
          from: eventLog.args?.[0] as string,
          to: eventLog.args?.[1] as string,
          tokenId: eventLog.args?.[2]?.toString() as string,
          status,
          gasUsed: txReceipt?.gasUsed.toString() ?? "0",
          gasPrice: tx?.gasPrice
            ? ethers.formatUnits(tx.gasPrice, "gwei")
            : "0",
          transactionFee,
          date: block.timestamp
            ? new Date(block.timestamp * 1000).toISOString()
            : "Unknown date",
          transactionHash: eventLog.transactionHash,
          blockNumber: blockNumber.toString(),
        };
      })
    );

    setHistory(parsedLogs);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <Card className="sm:col-span-4" x-chunk="dashboard-05-chunk-0">
                <CardHeader className="pb-3">
                  <CardTitle>NFT 배지 부여하기</CardTitle>
                  <CardDescription className="text-balance max-w-lg leading-relaxed">
                    유저의 지갑 주소를 입력하여 NFT 배지를 부여하세요!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="address">지갑 주소</Label>
                      <Input
                        id="address"
                        placeholder="0x0000000000000000000000000"
                        required
                        value={receiver}
                        onChange={(e) => setReceiver(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={grantNftBadge}>부여하기</Button>
                </CardFooter>
              </Card>
            </div>
            <HistoryList
              history={history}
              onClickItem={(item: THistory) => setHistoryDetail(item)}
            />
          </div>
          <div>{historyDetail && <HistoryDetail data={historyDetail} />}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
