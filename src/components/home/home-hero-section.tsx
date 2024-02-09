import { type Session } from "next-auth";
import Link from "next/link";
import {
  PiDiscordLogoDuotone,
  PiMonitorDuotone,
  PiScrollDuotone,
  PiShareNetworkDuotone,
} from "react-icons/pi";

import BackgroundGrid from "~/components/common/background-grid";
import Container from "~/components/common/container";
import SignInButton from "~/components/common/sign-in-button";
import { buttonVariants } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

export default function HomeHeroSection({
  session,
}: {
  session: Session | null;
}) {
  return (
    <div className="relative border-b pb-20">
      <BackgroundGrid isometric />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/5" />
      <Container className="relative">
        <div className="mx-auto max-w-2xl justify-center text-center lg:col-span-6 lg:flex lg:items-center">
          <div className="appear-first relative z-10 flex flex-col items-center justify-center gap-4 pt-[90px] sm:mx-auto md:w-3/4 lg:mx-0 lg:h-auto lg:min-h-[300px] lg:w-full lg:gap-8 lg:pt-[70px]">
            <div className="flex flex-col items-center">
              <h1 className="text-foreground text-4xl sm:text-5xl sm:leading-none lg:text-7xl">
                <span className="block bg-gradient-to-b from-primary-foreground to-primary-foreground/80 bg-clip-text text-transparent">
                  One Token Checker
                </span>
                <span className="block bg-gradient-to-br from-primary/70 via-primary to-primary/80 bg-clip-text text-transparent md:ml-0">
                  Endless Features
                </span>
              </h1>
              <p className="my-3 pt-2 text-sm sm:mt-5 sm:text-base lg:mb-0 lg:text-lg">
                Check thousands of Discord tokens within minutes.{" "}
                <br className="hidden md:block" />
                Manage your all your checked accounts with the details provided
                by Discord and advanced analytics to differentiate between them.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 md:mt-16 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:gap-6">
            <Card className="p-4 space-y-2 hover:-translate-y-[2px] hover:border-primary transition duration-300">
              <div className="flex items-center space-x-2">
                <PiDiscordLogoDuotone className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                <div className="flex flex-col leading-3">
                  <h2 className="text-sm md:text-base font-medium">
                    Easy Discord Account Management
                  </h2>
                  <small className="text-muted-foreground font-light text-xs font-mono hidden md:block">
                    Always keep track of your Discord accounts.
                  </small>
                </div>
              </div>

              <p className="leading-snug md:text-sm font-light text-xs">
                View all the needed account information, including the Discord
                account username, discriminator, badges and a calculated rating
                of the accounts trustworthiness.
              </p>
            </Card>
            <Card className="p-4 space-y-2 hover:-translate-y-[2px] hover:border-primary transition duration-300">
              <div className="flex items-center space-x-2">
                <PiMonitorDuotone className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                <div className="flex flex-col leading-3">
                  <h2 className="text-sm md:text-base font-medium">
                    Clean Dashboard
                  </h2>
                  <small className="text-muted-foreground font-light text-xs font-mono hidden md:block">
                    Beautifully designed and easy to use.
                  </small>
                </div>
              </div>

              <p className="leading-snug md:text-sm font-light text-xs">
                See how many verified, unverified, flagged and nitro accounts
                you own. And check out advanced stats like the country
                distribution, newest accounts and more.
              </p>
            </Card>

            <Card className="p-4 space-y-2 hover:-translate-y-[2px] hover:border-primary transition duration-300">
              <div className="flex items-center space-x-2">
                <PiScrollDuotone className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                <div className="flex flex-col leading-3">
                  <h2 className="text-sm md:text-base font-medium">
                    0-log Policy
                  </h2>
                  <small className="text-muted-foreground font-light text-xs font-mono hidden md:block">
                    We value your privacy.
                  </small>
                </div>
              </div>

              <p className="leading-snug md:text-sm font-light text-xs">
                We do not log anything that could be used to identify you. You
                will always have the option to delete your account and all
                related data with the click of a button.
              </p>
            </Card>

            <Card className="p-4 space-y-2 hover:-translate-y-[2px] hover:border-primary transition duration-300">
              <div className="flex items-center space-x-2">
                <PiShareNetworkDuotone className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                <div className="flex flex-col leading-3">
                  <h2 className="text-sm md:text-base font-medium">
                    Advanced Integrations
                  </h2>
                  <small className="text-muted-foreground font-light text-xs font-mono hidden md:block">
                    Built from developers for developers.
                  </small>
                </div>
              </div>

              <p className="leading-snug md:text-sm font-light text-xs">
                Integrate your own applications with our API to automate the
                process of checking and managing your Discord tokens. We provide
                a simple and easy to use API to get you started.
              </p>
            </Card>
          </div>

          <div className="flex items-center gap-2 mt-8 md:mt-16 justify-center">
            {session ? (
              <Link
                href="/dashboard"
                className={buttonVariants({
                  variant: "default",
                })}
              >
                Manage Discord Tokens
              </Link>
            ) : (
              <SignInButton size="default">Manage Discord Tokens</SignInButton>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
