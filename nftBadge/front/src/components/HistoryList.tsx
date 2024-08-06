import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { THistory } from "@/pages/AdminPage";

export const HistoryList = ({
  history,
  onClickItem,
}: {
  history: THistory[];
  onClickItem: (item: THistory) => void;
}) => {
  return (
    <Tabs defaultValue="week">
      <TabsContent value="week">
        <Card x-chunk="dashboard-05-chunk-3">
          <CardHeader className="px-7">
            <CardTitle>NFT 배지 부여 목록</CardTitle>
            <CardDescription>
              최근 NFT 배지를 부여한 목록입니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>지갑 주소</TableHead>
                  <TableHead className="hidden sm:table-cell">NFT ID</TableHead>
                  <TableHead className="hidden sm:table-cell">상태</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item: THistory) => (
                  <TableRow
                    key={item.transactionHash}
                    onClick={() => onClickItem(item)}
                  >
                    <TableCell>{item.to}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {item.tokenId}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge className="text-xs" variant="default">
                        {item.status === "granted" ? "발급" : "회수"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(item.date).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
