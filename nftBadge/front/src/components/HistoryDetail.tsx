import { Copy, Trash2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { THistory } from "@/pages/AdminPage";
import { formatAddress } from "@/lib/utils";

export const HistoryDetail = ({
  data,
  onClickBurn,
}: {
  data: THistory;
  onClickBurn: (tokenId: string) => void;
}) => {
  return (
    <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            {`NFT 배지 # ${data.tokenId}`}
            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Copy className="h-3 w-3" />
              <span className="sr-only">Copy Order ID</span>
            </Button>
          </CardTitle>
          <CardDescription>{`발급일 : ${new Date(
            data.date
          ).toLocaleString()}`}</CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1"
            onClick={() => onClickBurn(data.tokenId)}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
              회수
            </span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">상세 내역</div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">NFT Badge Id</span>
              <span>{data.tokenId}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">받은 주소</span>
              <span>{formatAddress(data.to)}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">블록 번호</span>
              <span>{data.blockNumber}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">TxId</span>
              <span>
                <Button size="sm" asChild variant="ghost">
                  <a
                    href={`https://sepolia.etherscan.io/tx/${data.transactionHash}`}
                  >
                    이더스캔
                  </a>
                </Button>
              </span>
            </li>
          </ul>
          <Separator className="my-2" />
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">가스 가격</span>
              <span>{`${data.gasPrice} gwei`}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">가스 사용량</span>
              <span>{`${data.gasUsed} units`}</span>
            </li>
            <li className="flex items-center justify-between font-semibold">
              <span className="text-muted-foreground">트랜잭션 수수료</span>
              <span>{`${data.transactionFee} ETH`}</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
