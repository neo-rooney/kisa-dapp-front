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
