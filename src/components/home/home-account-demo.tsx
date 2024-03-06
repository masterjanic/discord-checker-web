"use client";

import Link from "next/link";
import {
  PiFunnelDuotone,
  PiNumberCircleOneDuotone,
  PiStarDuotone,
} from "react-icons/pi";

import AccountCard from "~/app/_components/customer/account-card";
import Container from "~/components/common/container";
import { buttonVariants } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

export default function HomeAccountDemo() {
  return (
    <Container className="relative isolate max-w-6xl pt-20 lg:pt-28 space-y-12">
      <div className="absolute inset-x-0 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl">
        <div
          className="aspect-[14/6] w-[69.25rem] flex-none bg-gradient-to-r from-primary to-primary/40 opacity-10"
          style={{
            clipPath:
              "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
          }}
        />
      </div>
      <div className="grid grid-cols-1 place-items-center md:grid-cols-2 gap-6 md:gap-16">
        <div className="text-center max-w-md space-y-2">
          <h2 className="text-3xl font-semibold block bg-gradient-to-b from-primary-foreground to-primary-foreground/80 bg-clip-text text-transparent">
            Nice Discord Account, right?
          </h2>
          <h3 className="text-lg font-medium block bg-gradient-to-br from-primary/70 via-primary to-primary/80 bg-clip-text text-transparent md:ml-0">
            Clearly arranged account card with <strong>all</strong> the needed
            information.
          </h3>
        </div>
        <AccountCard
          className="w-full max-w-[500px]"
          account={{
            id: "343513497613371337",
            avatar: "/images/demo/demo_avatar.jpg",
            discriminator: "1337",
            rating: 95,
            flags: BigInt(1196672),
            username: "P1ckleR1ck",
            locale: "en-US",
          }}
          demo
        />
      </div>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Card className="hover:-translate-y-[2px] duration-300 hover:border-primary">
          <CardHeader>
            <div className="flex items-center space-x-1.5">
              <PiStarDuotone className="h-4 w-4 text-primary" />
              <CardTitle>Account Badges and Flags</CardTitle>
            </div>
            <CardDescription>
              The account card displays all the badges and flags of the account.
              You can directly see whether the account is verified, a bot or has
              other special flags.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="hover:-translate-y-[2px] duration-300 hover:border-primary">
          <CardHeader>
            <div className="flex items-center space-x-1.5">
              <PiNumberCircleOneDuotone className="h-4 w-4 text-primary" />
              <CardTitle>Account Rating</CardTitle>
            </div>
            <CardDescription>
              A calculated rating of the accounts trustworthiness. The rating is
              based on the accounts flags and other factors, like the account
              age.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="hover:-translate-y-[2px] duration-300 hover:border-primary ">
          <CardHeader>
            <div className="flex items-center space-x-1.5">
              <PiFunnelDuotone className="h-4 w-4 text-primary" />
              <CardTitle>Advanced Filtering</CardTitle>
            </div>
            <CardDescription>
              Filter your accounts by flags, rating, country and more. This way
              you can easily find the accounts you are looking for. You can also
              search for accounts by their username.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
      <div className="text-center">
        <Link
          href="/features/advanced-account-details"
          className={buttonVariants({ variant: "secondary" })}
        >
          Read more
        </Link>
      </div>
    </Container>
  );
}
