"use client";

import { type Session } from "next-auth";
import Link from "next/link";
import { PiCrownDuotone } from "react-icons/pi";

import UserAvatar from "~/app/_components/admin/user-avatar";
import Container from "~/components/common/container";
import SignInButton from "~/components/common/sign-in-button";
import { buttonVariants } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { isAdministrator, isUserSubscribed } from "~/lib/auth";
import { getRelativeTime } from "~/lib/time";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export default function LeaderboardCard({
  session,
}: {
  session: Session | null;
}) {
  const [users] = api.public.leaderboard.getRanking.useSuspenseQuery(
    undefined,
    {
      refetchInterval: 30_000,
    },
  );

  return (
    <Container>
      {users.map((user, index) => (
        <div key={`leaderboard-user-${user.id}`}>
          <div
            className={cn(
              "py-4 px-4 bg-muted/30 hover:bg-muted/40 transition duration-300 border-x border-t",
              index === 0 && "rounded-t-lg",
              index === users.length - 1 && "border-b rounded-b-lg",
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="hidden md:block mr-2">
                  <div
                    className={cn(
                      "grid place-items-center h-6 w-6 rounded-full bg-foreground/10 flex-shrink-0",
                      index === 0 && "bg-yellow-600",
                      index === 1 && "bg-slate-500",
                      index === 2 && "bg-orange-700",
                    )}
                  >
                    <span className="text-xs">{index + 1}</span>
                  </div>
                </div>
                <div className="flex-shrink-0 mr-2">
                  {user.publicProfile && !user.publicAnonymous ? (
                    <Link href={`/u/${user.name}`}>
                      <UserAvatar user={user} size={40} />
                    </Link>
                  ) : (
                    <UserAvatar user={user} size={40} />
                  )}
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center space-x-1.5">
                    <div className="max-w-[130px] sm:max-w-full">
                      {user.name &&
                      user.publicProfile &&
                      !user.publicAnonymous ? (
                        <Link href={`/u/${user.name}`}>
                          <h3
                            className={cn(
                              "text-base font-medium truncate",
                              isUserSubscribed(user) &&
                                "font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-yellow-300 to-yellow-500",
                            )}
                          >
                            {user.name ?? "Unnamed User"}
                          </h3>
                        </Link>
                      ) : (
                        <h3
                          className={cn(
                            "text-base font-medium truncate",
                            isUserSubscribed(user) &&
                              "font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-yellow-300 to-yellow-500",
                          )}
                        >
                          {user.name ?? "Unnamed User"}
                        </h3>
                      )}
                    </div>
                    {isUserSubscribed(user) && (
                      <TooltipProvider>
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger>
                            <PiCrownDuotone className="text-yellow-300" />
                          </TooltipTrigger>
                          <TooltipContent>
                            {isAdministrator(user)
                              ? "Subscribed for Lifetime"
                              : `Subscribed till ${user.subscribedTill!.toLocaleDateString("en-US")}`}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <small className="text-muted-foreground text-xs">
                    Joined {getRelativeTime(user.createdAt)}
                  </small>
                </div>
              </div>

              <div className="flex flex-col space-y-1 text-center">
                <span className="uppercase tracking-wider font-extralight text-xs text-muted-foreground">
                  Accounts
                </span>
                <span className="font-bold">{user._count.discordAccounts}</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="mt-8 text-center">
        {!session ? (
          <SignInButton>Start checking your Discord tokens</SignInButton>
        ) : (
          <Link
            href="/dashboard"
            className={buttonVariants({
              size: "sm",
              variant: "secondary",
            })}
          >
            Back to Dashboard
          </Link>
        )}
      </div>
    </Container>
  );
}
