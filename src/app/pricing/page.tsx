import { FiCheck, FiX } from "react-icons/fi";

import Box from "~/app/_components/common/box";
import Container from "~/app/_components/common/container";
import Navbar from "~/app/_components/common/navbar";
import SignInButton from "~/app/_components/common/sign-in";
import { getServerAuthSession } from "~/server/auth";

export const metadata = {
  title: "Pricing | DTC-Web",
  robots: {
    index: true,
    follow: true,
  },
};

export default async function Page() {
  const session = await getServerAuthSession();

  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <div className="py-16 lg:py-20">
          <Container className="text-center">
            <h1 className="mb-4 text-base font-medium text-primary">Pricing</h1>
            <h2 className="text-2xl font-semibold">
              The best Discord token checker ever
            </h2>
            <p className="mt-4 text-lg text-neutral-300">
              Start checking your Discord tokens for free, view analytics and
              manage them easily.
            </p>
          </Container>
        </div>

        <Container>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:gap-2 2xl:gap-5">
            <Box>
              <h3 className="font-mono text-2xl font-normal uppercase text-primary">
                Free
              </h3>
              <p className="my-4 border-b border-neutral-100/10 pb-4 text-sm text-neutral-300">
                Perfect for testing the checker & checking a few tokens.
              </p>

              <div className="text-foreground flex min-h-[175px] items-baseline border-b border-neutral-100/10 pt-10 text-5xl font-normal lg:text-4xl xl:text-4xl">
                <div className="flex flex-col gap-1">
                  <div className="flex items-end gap-2">
                    <div>
                      <div className="flex items-end">
                        <p className="mt-2 bg-gradient-to-b from-neutral-100 to-neutral-500 bg-clip-text pb-1 text-5xl text-transparent">
                          $0
                        </p>
                        <p className="mb-1.5 ml-1 text-[13px] leading-4 text-neutral-400">
                          / month
                        </p>
                      </div>
                      <p className="-mt-2">
                        <span className="rounded-md border border-neutral-100/10 bg-blueish-grey-600 bg-opacity-30 px-2 py-0.5 text-[13px] leading-4 text-primary shadow-sm">
                          Limited features
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex h-full flex-1 flex-col rounded-bl-[4px] rounded-br-[4px] py-6">
                <p className="mb-4 mt-2 text-[13px] text-neutral-400">
                  Get started with:
                </p>

                <ul role="list" className="text-[13px] text-neutral-100">
                  <li className="flex items-center py-2 first:mt-0">
                    <FiCheck className="h-4 w-4 text-blurple" />
                    <span className="mb-0 ml-3 text-neutral-100">
                      Up to 10 Discord accounts
                    </span>
                  </li>
                  <li className="flex items-center py-2 first:mt-0">
                    <FiCheck className="h-4 w-4 text-blurple" />
                    <span className="mb-0 ml-3 text-neutral-100">
                      Basic features such as account details
                    </span>
                  </li>
                  <li className="flex items-center py-2 first:mt-0">
                    <FiCheck className="h-4 w-4 text-blurple" />
                    <span className="mb-0 ml-3 text-neutral-100">
                      Fast login with the Chrome extension
                    </span>
                  </li>
                  <li className="flex items-center py-2 first:mt-0">
                    <FiX className="h-4 w-4 text-neutral-500" />
                    <span className="mb-0 ml-3 text-neutral-100">
                      Token Collections for categorizing tokens
                    </span>
                  </li>
                  <li className="flex items-center py-2 first:mt-0">
                    <FiX className="h-4 w-4 text-neutral-500" />
                    <span className="mb-0 ml-3 text-neutral-100">
                      Interval Token Checks
                    </span>
                  </li>
                </ul>

                <div className="mt-6">
                  <SignInButton
                    authed={!!session}
                    className="w-full py-2 !text-base"
                  >
                    Get Started
                  </SignInButton>
                </div>
              </div>
            </Box>
            <Box>
              <h3 className="font-mono text-2xl font-normal uppercase text-primary">
                Supporter
              </h3>
              <p className="my-4 border-b border-neutral-100/10 pb-4 text-sm text-neutral-300">
                For those who want to support the project and get some extra
                features.
              </p>

              <div className="text-foreground flex min-h-[175px] items-baseline border-b border-neutral-100/10 pt-10 text-5xl font-normal lg:text-4xl xl:text-4xl">
                <div className="flex flex-col gap-1">
                  <div className="flex items-end gap-2">
                    <div>
                      <div className="flex items-end">
                        <p className="mt-2 bg-gradient-to-b from-neutral-100 to-neutral-500 bg-clip-text pb-1 text-5xl text-transparent">
                          $4.99
                        </p>
                        <p className="mb-1.5 ml-1 text-[13px] leading-4 text-neutral-400">
                          / month
                        </p>
                      </div>
                      <p className="-mt-2">
                        <span className="rounded-md border border-neutral-100/10 bg-blueish-grey-600 bg-opacity-30 px-2 py-0.5 text-[13px] leading-4 text-primary shadow-sm">
                          All features
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex h-full flex-1 flex-col rounded-bl-[4px] rounded-br-[4px] py-6">
                <p className="mb-4 mt-2 text-[13px] text-neutral-400">
                  Level up with:
                </p>

                <ul role="list" className="text-[13px] text-neutral-100">
                  <li className="flex items-center py-2 first:mt-0">
                    <FiCheck className="h-4 w-4 text-blurple" />
                    <span className="mb-0 ml-3 text-neutral-100">
                      Unlimited Discord accounts
                    </span>
                  </li>
                  <li className="flex items-center py-2 first:mt-0">
                    <FiCheck className="h-4 w-4 text-blurple" />
                    <span className="mb-0 ml-3 text-neutral-100">
                      Advanced account analytics
                    </span>
                  </li>
                  <li className="flex items-center py-2 first:mt-0">
                    <FiCheck className="h-4 w-4 text-blurple" />
                    <span className="mb-0 ml-3 text-neutral-100">
                      Fast login with the Chrome extension
                    </span>
                  </li>
                  <li className="flex items-center py-2 first:mt-0">
                    <FiCheck className="h-4 w-4 text-blurple" />
                    <span className="mb-0 ml-3 text-neutral-100">
                      Unlimited Token Collections for categorizing tokens
                    </span>
                  </li>
                  <li className="flex items-center py-2 first:mt-0">
                    <FiCheck className="h-4 w-4 text-blurple" />
                    <span className="mb-0 ml-3 text-neutral-100">
                      Interval Token Checks up to every hour
                    </span>
                  </li>
                </ul>

                <div className="mt-6">
                  <SignInButton
                    authed={!!session}
                    className="w-full py-2 !text-base"
                  >
                    Get Started
                  </SignInButton>
                </div>
              </div>
            </Box>
          </div>
        </Container>
      </main>
    </>
  );
}
