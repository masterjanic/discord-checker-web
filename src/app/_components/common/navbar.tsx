import { type Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { SiGithub } from "react-icons/si";

import Container from "~/app/_components/common/container";
import SignInButton from "~/app/_components/common/sign-in";

export default function Navbar({ session }: { session: Session | null }) {
  return (
    <div className="sticky top-0 z-40">
      <div className="absolute inset-0 h-full w-full bg-blueish-grey-900/90" />
      <nav className="relative z-40 border-b border-neutral-100/10 backdrop-blur-sm transition-opacity">
        <Container className="flex h-16 justify-between">
          <div className="flex flex-1 items-center justify-between px-6 sm:items-stretch lg:px-0">
            <div className="flex items-center">
              <div className="flex flex-shrink-0 items-center">
                <Link className="block h-7 w-auto" href="/">
                  <Image
                    src="/images/logo.png"
                    className="h-7 w-auto rounded-full border border-neutral-100/10"
                    alt="DTC-Web logo"
                    width={28}
                    height={28}
                  />
                </Link>
              </div>
              <nav
                className="relative z-10 hidden h-16 flex-1 items-center justify-center pl-8 sm:space-x-4 lg:flex"
                dir="ltr"
                aria-label="Main"
              >
                <div className="relative">
                  <ul
                    className="group flex flex-1 list-none items-center justify-center space-x-4"
                    dir="ltr"
                  >
                    <li className="text-sm font-medium">
                      <Link
                        href="/pricing"
                        className="group flex items-center text-sm text-neutral-100 transition duration-300 hover:text-blurple"
                      >
                        Pricing
                      </Link>
                    </li>
                    <li className="text-sm font-medium">
                      <Link
                        href="/security-check"
                        className="group flex items-center text-sm text-neutral-100 transition duration-300 hover:text-blurple"
                      >
                        Account Security Check
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="absolute left-0 top-full flex justify-center" />
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="https://github.com/masterjanic/discord-checker-web"
                className="group relative hidden cursor-pointer items-center justify-center space-x-2 rounded-md px-2.5 py-1.5 text-xs text-neutral-300 outline-0 transition duration-300 hover:bg-blueish-grey-700 hover:text-neutral-100 lg:flex"
                target="_blank"
              >
                <span className="truncate">
                  <span className="flex items-center gap-2">
                    <SiGithub className="h-5 w-5" />
                  </span>
                </span>
              </Link>

              <SignInButton authed={!!session}>
                {!session ? "Sign in" : "Dashboard"}
              </SignInButton>
            </div>
          </div>
        </Container>
      </nav>
    </div>
  );
}
