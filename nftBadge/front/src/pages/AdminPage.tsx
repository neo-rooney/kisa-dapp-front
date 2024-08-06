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

const AdminPage = () => {
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
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="nftId">NFT ID</Label>
                      <Input id="nftId" placeholder="0" required />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>부여하기</Button>
                </CardFooter>
              </Card>
            </div>
            <HistoryList />
          </div>
          <div>
            <HistoryDetail />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
