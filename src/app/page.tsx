import Image from "next/image";

import Box from "~/app/_components/common/box";
import Container from "~/app/_components/common/container";
import Navbar from "~/app/_components/common/navbar";
import SignInButton from "~/app/_components/common/sign-in";
import { getServerAuthSession } from "~/server/auth";

export default async function Page() {
  const session = await getServerAuthSession();

  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <Container>
          <div className="mx-auto max-w-2xl justify-center text-center lg:col-span-6 lg:flex lg:items-center">
            <div className="appear-first relative z-10 flex flex-col items-center justify-center gap-4 pt-[90px] sm:mx-auto md:w-3/4 lg:mx-0 lg:h-auto lg:min-h-[300px] lg:w-full lg:gap-8 lg:pt-[90px]">
              <div className="flex flex-col items-center">
                <h1 className="text-foreground text-4xl sm:text-5xl sm:leading-none lg:text-7xl">
                  <span className="block bg-gradient-to-b from-neutral-100 to-neutral-300 bg-clip-text text-transparent">
                    One Token Checker
                  </span>
                  <span className="block bg-gradient-to-br from-blurple-legacy via-blurple to-blurple-dark bg-clip-text text-transparent md:ml-0">
                    Endless Features
                  </span>
                </h1>
                <p className="my-3 pt-2 text-sm text-neutral-100 sm:mt-5 sm:text-base lg:mb-0 lg:text-lg">
                  Check thousands of Discord tokens within minutes.{" "}
                  <br className="hidden md:block" />
                  Manage your all your checked accounts with the details
                  provided by Discord to differentiate between them.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <SignInButton className="!text-base" authed={!!session}>
                  Manage Discord Tokens
                </SignInButton>
              </div>
            </div>
          </div>
        </Container>

        <Container className="sm:py-18 py-16 md:py-24 lg:px-16 lg:py-24 xl:px-20">
          <div className="grid grid-cols-1 gap-16 sm:grid-cols-2 md:grid-cols-12">
            <Box className="glow group relative w-full max-h-[400px] flex flex-col gap-5 lg:flex-row col-span-6 lg:col-span-12 xl:col-span-6 border border-neutral-100/10 rounded-md !p-1 hover:-translate-y-2 transition duration-300">
              <Image
                className="object-cover object-left"
                src="/images/demo/accounts.png"
                alt="Discord Account Management Overview"
                width={1087}
                height={504}
              />
            </Box>

            <div className="flex flex-col gap-5 lg:flex-row col-span-6 lg:col-span-12 xl:col-span-6 items-center">
              <div>
                <h2 className="text-neutral-100 text-xl font-medium mb-4">
                  Easy Discord Account Management
                </h2>
                <p className="text-neutral-300 font-light">
                  Always keep track of your Discord accounts. You can easily see
                  important account information in the account overview.
                  <br /> <br />
                  This includes the Discord account's username, discriminator,
                  badges and a calculated rating of the accounts
                  trustworthiness. <br /> <br />
                  It is also possible to filter and search your Discord accounts
                  by their features.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-5 lg:flex-row col-span-6 lg:col-span-12 xl:col-span-6 items-center">
              <div>
                <h2 className="text-neutral-100 text-xl font-medium mb-4">
                  Clean Dashboard
                </h2>
                <p className="text-neutral-300 font-light">
                  The dashboard will always show you the stats of all your
                  managed Discord accounts. <br /> <br />
                  See how many verified, unverified, flagged and nitro accounts
                  you own. And check out advanced stats like the country
                  distribution.
                </p>
              </div>
            </div>

            <Box className="glow group relative w-full max-h-[400px] flex flex-col gap-5 lg:flex-row col-span-6 lg:col-span-12 xl:col-span-6 border border-neutral-100/10 rounded-md !p-1 hover:-translate-y-2 transition duration-300">
              <Image
                className="object-cover object-left"
                src="/images/demo/dashboard.png"
                alt="Discord Account Dashboard"
                width={1642}
                height={631}
              />
            </Box>

            <Box className="glow group relative w-full max-h-[400px] flex flex-col gap-5 lg:flex-row col-span-6 lg:col-span-12 xl:col-span-6 border border-neutral-100/10 rounded-md !p-1 hover:-translate-y-2 transition duration-300">
              <Image
                className="object-cover object-left"
                src="/images/demo/account_view.png"
                alt="DTC-Web Discord Account View"
                width={1643}
                height={632}
              />
            </Box>

            <div className="flex flex-col gap-5 lg:flex-row col-span-6 lg:col-span-12 xl:col-span-6 items-center">
              <div>
                <h2 className="text-neutral-100 text-xl font-medium mb-4">
                  Advanced Discord Account Information
                </h2>
                <p className="text-neutral-300 font-light">
                  Directly see all the things you need about your Discord
                  account and related tokens. <br /> <br />
                  You can view the servers the account is in, the billing
                  methods and add notes, without needing to open Discord.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-5 lg:flex-row col-span-6 lg:col-span-12 xl:col-span-6 items-center">
              <div>
                <h2 className="text-neutral-100 text-xl font-medium mb-4">
                  0-log Policy
                </h2>
                <p className="text-neutral-300 font-light">
                  We do not log anything that could be used to identify you.
                  This means we store no such data as IP addresses, emails,
                  passwords, etc. <br /> <br />
                  You will always have the option to delete your account and all
                  related data with the click of a button.
                </p>
              </div>
            </div>

            <Box className="glow group relative w-full max-h-[400px] flex flex-col gap-5 lg:flex-row col-span-6 lg:col-span-12 xl:col-span-6 border border-neutral-100/10 rounded-md !p-1 hover:-translate-y-2 transition duration-300">
              <Image
                className="object-cover object-left"
                src="/images/demo/account_danger.png"
                alt="DTC-Web Profile Management"
                width={789}
                height={420}
              />
            </Box>
          </div>
        </Container>
      </main>
    </>
  );
}
