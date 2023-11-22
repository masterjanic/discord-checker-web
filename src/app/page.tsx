import { getServerAuthSession } from "~/server/auth";
import Container from "~/app/_components/common/container";
import SignInButton from "~/app/_components/common/sign-in";
import Navbar from "~/app/_components/common/navbar";

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
      </main>
    </>
  );
}
