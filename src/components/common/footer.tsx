import Image from "next/image";
import Link from "next/link";
import { type IconType } from "react-icons";
import {
  PiDiscordLogoDuotone,
  PiGithubLogoDuotone,
  PiGoogleChromeLogoDuotone,
} from "react-icons/pi";

import Container from "~/components/common/container";
import {
  CHROME_EXTENSION_URL,
  GITHUB_URL,
  SUPPORT_DISCORD_URL,
} from "~/consts/internal";
import { NAV_LINKS } from "~/consts/nav";

const FOOTER_SOCIALS = [
  {
    title: "GitHub",
    href: GITHUB_URL,
    icon: PiGithubLogoDuotone as IconType,
  },
  {
    title: "Discord",
    href: SUPPORT_DISCORD_URL,
    icon: PiDiscordLogoDuotone as IconType,
  },
  {
    title: "Chrome Addon",
    href: CHROME_EXTENSION_URL,
    icon: PiGoogleChromeLogoDuotone as IconType,
  },
];

const FOOTER_LINKS = [
  {
    title: "Informational",
    links: NAV_LINKS.filter((link) => !!link.href),
  },
  ...NAV_LINKS.filter((link) => !link.href).map((link) => ({
    title: link.title,
    links: link.components!,
  })),
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Company Information"].map(
      (title) => ({
        title,
        href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      }),
    ),
  },
] as const;

export default function Footer() {
  return (
    <footer className="mt-20 border-t">
      <Container className="py-8 lg:pt-16">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="self-center pb-14 pt-20 lg:col-span-1 lg:py-0">
            <div className="relative flex place-content-center items-center">
              <div className="absolute">
                <Image
                  src="/images/logo.png"
                  alt="DTC-Web: Logo; Evil Discord icon with a deadly smile"
                  height={192}
                  width={192}
                  className="pointer-events-none h-48 w-auto transform select-none rounded-md bg-center opacity-5"
                />
              </div>
              <div className="relative space-y-3">
                <div className="flex place-content-center">
                  <h2 className="text-4xl font-bold">DTC-Web</h2>
                </div>
                <ul
                  role="list"
                  className="flex items-center justify-center space-x-4"
                >
                  {FOOTER_SOCIALS.map(({ title, href, icon: Icon }) => (
                    <li key={`footer-${title.toLowerCase()}`}>
                      <Link
                        href={href}
                        className="transition duration-300 hover:text-muted-foreground"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="sr-only">{title}</span>
                        <Icon className="h-5 w-5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8 transition-all md:grid-cols-3 lg:col-span-2 lg:mt-0">
            {FOOTER_LINKS.map(({ links, title }) => (
              <div key={`footer-${title.toLowerCase()}`}>
                <h5 className="text-sm font-semibold">{title}</h5>
                <ul role="list" className="mt-3 space-y-2">
                  {links.map(({ href, title: innerTitle }) => (
                    <li key={`footer-${innerTitle.toLowerCase()}`}>
                      <Link
                        href={href!}
                        className="inline-flex items-center space-x-2 transform text-sm font-normal text-muted-foreground transition-all duration-300 hover:text-primary"
                      >
                        <span>{innerTitle}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-20 border-t pt-8 text-center">
          <p className="text-sm font-normal text-muted-foreground">
            © {new Date().getFullYear()} DTC-Web — All rights reserved.
          </p>
          <p className="text-xs font-light text-muted-foreground mt-2">
            The fucking best Discord token checker to ever exist.
          </p>
        </div>
      </Container>
    </footer>
  );
}
