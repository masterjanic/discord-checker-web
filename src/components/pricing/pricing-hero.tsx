import { type Session } from "next-auth";
import Link from "next/link";
import { FiCheck, FiX } from "react-icons/fi";

import Container from "~/components/common/container";
import SignInButton from "~/components/common/sign-in-button";
import { Badge } from "~/components/ui/badge";
import { buttonVariants } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { FREE_ACCOUNTS_LIMIT } from "~/consts/discord";
import { cn } from "~/lib/utils";

export default function PricingHero({ session }: { session: Session | null }) {
  return (
    <>
      <Container className="text-center max-w-xl">
        <h1 className="mb-4 text-base font-medium text-primary">Pricing</h1>
        <h2 className="text-2xl font-semibold">
          The best Discord Token Checker ever
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Start checking your Discord tokens for free, view analytics and manage
          them easily.
        </p>
      </Container>
      <Container className="mt-16 lg:mt-20">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:gap-2 2xl:gap-5">
          <Card className="p-6 bg-muted/10">
            <h3 className="font-mono text-2xl font-normal uppercase text-primary">
              Free
            </h3>
            <p className="my-4 border-b pb-4 text-sm">
              Perfect for testing the checker and managing a few tokens.
            </p>

            <div className="text-foreground flex min-h-[175px] items-baseline border-b pt-10 text-5xl font-normal lg:text-4xl xl:text-4xl">
              <div className="flex flex-col gap-1">
                <div className="flex items-end gap-2">
                  <div>
                    <div className="flex items-end">
                      <p className="mt-2 bg-gradient-to-b from-neutral-100 to-neutral-500 bg-clip-text pb-1 text-5xl text-transparent">
                        $0
                      </p>
                      <p className="mb-1.5 ml-1 text-[13px] leading-4 text-muted-foreground">
                        / month
                      </p>
                    </div>
                    <p className="-mt-2">
                      <Badge variant="secondary">Limited features</Badge>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex h-full flex-1 flex-col rounded-bl-[4px] rounded-br-[4px] py-6">
              <p className="mb-4 mt-2 text-[13px] text-muted-foreground">
                Get started with:
              </p>

              <ul role="list" className="text-[13px] ">
                <li className="flex items-center py-2 first:mt-0">
                  <FiCheck className="h-4 w-4 text-primary" />
                  <span className="mb-0 ml-3 ">
                    Up to {FREE_ACCOUNTS_LIMIT} managed Discord accounts
                  </span>
                </li>
                <li className="flex items-center py-2 first:mt-0">
                  <FiCheck className="h-4 w-4 text-primary" />
                  <span className="mb-0 ml-3 ">
                    Basic features such as account details
                  </span>
                </li>
                <li className="flex items-center py-2 first:mt-0">
                  <FiCheck className="h-4 w-4 text-primary" />
                  <span className="mb-0 ml-3 ">
                    Fast login with the Chrome extension
                  </span>
                </li>
                <li className="flex items-center py-2 first:mt-0">
                  <FiX className="h-4 w-4 text-neutral-500" />
                  <span className="mb-0 ml-3 ">
                    Token Collections for categorizing tokens
                  </span>
                </li>
                <li className="flex items-center py-2 first:mt-0">
                  <FiX className="h-4 w-4 text-neutral-500" />
                  <span className="mb-0 ml-3 ">Interval Token Checks</span>
                </li>
              </ul>

              {session ? (
                <Link
                  href="/profile"
                  className={cn(buttonVariants({ size: "lg" }), "mt-6")}
                >
                  Get Started
                </Link>
              ) : (
                <SignInButton size="lg" className="w-full mt-6">
                  Get Started
                </SignInButton>
              )}
            </div>
          </Card>
          <div className="lg:-mt-8">
            <p className="text-[13px] leading-4 text-center py-2 bg-primary rounded-t-lg font-medium">
              Recommended
            </p>
            <Card className="border-primary border-2 rounded-t-none p-6 bg-muted/10">
              <h3 className="font-mono text-2xl font-normal uppercase text-primary">
                Supporter
              </h3>
              <p className="my-4 border-b pb-4 text-sm">
                For those who want to support the project and get some extra
                features.
              </p>

              <div className="text-foreground flex min-h-[175px] items-baseline border-b pt-10 text-5xl font-normal lg:text-4xl xl:text-4xl">
                <div className="flex flex-col gap-1">
                  <div className="flex items-end gap-2">
                    <div>
                      <div className="flex items-end">
                        <p className="mt-2 bg-gradient-to-b from-neutral-100 to-neutral-500 bg-clip-text pb-1 text-5xl text-transparent">
                          $4.99
                        </p>
                        <p className="mb-1.5 ml-1 text-[13px] leading-4 text-muted-foreground">
                          / month
                        </p>
                      </div>
                      <p className="-mt-2">
                        <Badge variant="secondary">All features</Badge>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex h-full flex-1 flex-col rounded-bl-[4px] rounded-br-[4px] py-6">
                <p className="mb-4 mt-2 text-[13px] text-muted-foreground">
                  Everything in the Free plan, plus:
                </p>

                <ul role="list" className="text-[13px] ">
                  <li className="flex items-center py-2 first:mt-0">
                    <FiCheck className="h-4 w-4 text-primary" />
                    <span className="mb-0 ml-3 ">
                      Unlimited managed Discord accounts
                    </span>
                  </li>
                  <li className="flex items-center py-2 first:mt-0">
                    <FiCheck className="h-4 w-4 text-primary" />
                    <span className="mb-0 ml-3 ">
                      Advanced account analytics
                    </span>
                  </li>
                  <li className="flex items-center py-2 first:mt-0">
                    <FiCheck className="h-4 w-4 text-primary" />
                    <span className="mb-0 ml-3 ">
                      Faster support response times
                    </span>
                  </li>
                  <li className="flex items-center py-2 first:mt-0">
                    <FiCheck className="h-4 w-4 text-primary" />
                    <span className="mb-0 ml-3 ">
                      Unlimited Token Collections for categorizing tokens
                    </span>
                  </li>
                  <li className="flex items-center py-2 first:mt-0">
                    <FiCheck className="h-4 w-4 text-primary" />
                    <span className="mb-0 ml-3 ">
                      Interval Token Checks up to every hour
                    </span>
                  </li>
                </ul>

                {session ? (
                  <Link
                    href="/profile"
                    className={cn(buttonVariants({ size: "lg" }), "mt-6")}
                  >
                    Purchase now
                  </Link>
                ) : (
                  <SignInButton size="lg" className="w-full mt-6">
                    Get Started
                  </SignInButton>
                )}
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link
            href="#compare-plans"
            className={buttonVariants({ variant: "secondary" })}
          >
            Compare Plans
          </Link>
        </div>
      </Container>
    </>
  );
}
