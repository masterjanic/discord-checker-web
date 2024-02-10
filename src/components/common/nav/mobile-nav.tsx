"use client";

import { type Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiMenu } from "react-icons/fi";
import { PiDiscordLogoDuotone, PiGithubLogoDuotone } from "react-icons/pi";

import { Button, buttonVariants } from "~/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "~/components/ui/sheet";
import { GITHUB_URL, SUPPORT_DISCORD_URL } from "~/consts/internal";
import { NAV_LINKS } from "~/consts/nav";
import { cn } from "~/lib/utils";

export default function MobileNav({ session }: { session: Session | null }) {
  const [isOpened, setOpened] = useState(false);

  // Close the mobile nav when the viewport changes in size/orientation
  useEffect(() => {
    const handleViewportChange = () => {
      setOpened(false);
    };

    window.addEventListener("resize", handleViewportChange);

    return () => {
      window.removeEventListener("resize", handleViewportChange);
    };
  }, [isOpened, setOpened]);

  return (
    <Sheet open={isOpened} onOpenChange={(open: boolean) => setOpened(open)}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <FiMenu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full">
        <SheetHeader>
          <SheetClose asChild>
            <Link href="/">
              <Image
                className="pointer-events-none h-9 w-auto select-none"
                src="/images/logo.png"
                alt="DTC-Web: Logo; Evil Discord icon with a deadly smile"
                width={36}
                height={36}
              />
            </Link>
          </SheetClose>
        </SheetHeader>
        <div className="py-6 px-1 flex flex-col divide-y">
          {NAV_LINKS.map((link) => {
            if ("components" in link) {
              return (
                <div className="py-4" key={`mobile-nav-component-${link.href}`}>
                  <p>{link.title}</p>
                  <ul className="flex flex-col gap-2 mt-2.5">
                    {link.components!.map((component) => (
                      <li key={component.title}>
                        <SheetClose asChild>
                          <Link
                            href={component.href}
                            className="text-sm font-light pl-1.5 hover:text-primary transition duration-300"
                          >
                            {component.title}
                          </Link>
                        </SheetClose>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }

            return (
              <SheetClose key={`mobile-nav-link-${link.href}`} asChild>
                <Link
                  className="py-4 hover:text-primary transition duration-300"
                  href={link.href}
                >
                  {link.title}
                </Link>
              </SheetClose>
            );
          })}
          <div className="py-4 space-y-2">
            {!session && (
              <Button
                className="w-full"
                variant="default"
                onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
              >
                Sign In
              </Button>
            )}

            {session && (
              <>
                <SheetClose asChild>
                  <Link
                    href="/dashboard"
                    className={cn(
                      buttonVariants({ variant: "default" }),
                      "w-full",
                    )}
                  >
                    Dashboard
                  </Link>
                </SheetClose>
                <Button
                  className="w-full"
                  variant="secondary"
                  onClick={() => signOut()}
                >
                  Sign out
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <Link
            href={SUPPORT_DISCORD_URL}
            target="_blank"
            className={buttonVariants({ size: "icon", variant: "ghost" })}
          >
            <span className="sr-only">Join the official support Discord</span>
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
      </SheetContent>
    </Sheet>
  );
}
