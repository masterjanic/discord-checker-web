import { Suspense } from "react";

import Container from "~/components/common/container";
import LeaderboardAccountDistributionCard from "~/components/leaderboard/leaderboard-account-distribution-card";
import LeaderboardCard from "~/components/leaderboard/leaderboard-card";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { generateMetadata } from "~/lib/metadata";
import { auth } from "~/server/auth";

export const metadata = generateMetadata({
  title: "Account Leaderboard",
  description:
    "Who got the most Discord tokens? Check out the top users on the account leaderboard.",
  url: "/leaderboard",
});

export default async function Page() {
  const session = await auth();

  return (
    <div className="py-16 lg:py-20">
      <Container className="text-center max-w-xl mb-12">
        <h1 className="mb-4 text-base font-medium text-primary">Leaderboard</h1>
        <h2 className="text-2xl font-semibold">
          Who got the most Discord tokens?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Check out the top users on the account leaderboard. <br />
          Who's leading the pack?
        </p>
      </Container>

      <Suspense
        fallback={
          <Container>
            <Skeleton className="w-full h-[835px]" />
          </Container>
        }
      >
        <LeaderboardCard session={session} />
      </Suspense>
      <Separator className="my-16 lg:my-20" />
      <Container>
        <Suspense fallback={<Skeleton className="w-full h-[506px]" />}>
          <LeaderboardAccountDistributionCard />
        </Suspense>
      </Container>
    </div>
  );
}
