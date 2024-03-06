import { type Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { PiDiscordLogoDuotone, PiGithubLogoDuotone } from "react-icons/pi";

import Container from "~/components/common/container";
import DesktopNav from "~/components/common/nav/desktop-nav";
import MobileNav from "~/components/common/nav/mobile-nav";
import NavbarActions from "~/components/common/nav/navbar-actions";
import { buttonVariants } from "~/components/ui/button";
import { GITHUB_URL, SUPPORT_DISCORD_URL } from "~/consts/internal";

export default function Navbar({ session }: { session: Session | null }) {
  return (
    <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur-xl">
      <Container className="flex items-center justify-between md:space-x-8 lg:justify-start">
        <div className="flex items-center justify-start py-4 xl:w-0 xl:flex-1">
          <Link href="/" className="flex flex-shrink-0 items-center">
            <Image
              className="pointer-events-none h-10 w-auto select-none"
              src="/images/logo.png"
              alt="DTC-Web: Logo; Evil Discord icon with a deadly smile"
              width={36}
              height={36}
              draggable={false}
            />
          </Link>
        </div>
        <div className="hidden space-x-6 lg:flex lg:items-center">
          <DesktopNav />
        </div>
        <div className="-my-2 py-6 lg:hidden">
          <MobileNav session={session} />
        </div>
        <div className="hidden items-center justify-end md:flex-1 lg:flex lg:w-0">
          <div className="flex gap-2 items-center">
            <div className="flex items-center">
              <Link
                href={SUPPORT_DISCORD_URL}
                target="_blank"
                className={buttonVariants({ size: "icon", variant: "ghost" })}
              >
                <span className="sr-only">
                  Join the official support Discord
                </span>
                <PiDiscordLogoDuotone className="h-4 w-4" />
              </Link>
              <Link
                href={GITHUB_URL}
                target="_blank"
                className={buttonVariants({ size: "icon", variant: "ghost" })}
              >
                <span className="sr-only">View the source code on GitHub</span>
                <PiGithubLogoDuotone className="h-4 w-4" />
              </Link>
            </div>
            <NavbarActions session={session} />
          </div>
        </div>
      </Container>
    </header>
  );
}
