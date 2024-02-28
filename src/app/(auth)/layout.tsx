import { Role } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  PiDiscordLogoDuotone,
  PiGoogleChromeLogoDuotone,
} from "react-icons/pi";
import { TbSlashes } from "react-icons/tb";

import SignOutSection from "~/app/_components/common/sign-out";
import NavRouterSegment from "~/app/_components/customer/nav-router-segment";
import BackgroundGrid from "~/components/common/background-grid";
import ImportContext from "~/components/customer/import/import-context";
import { buttonVariants } from "~/components/ui/button";
import { Toaster } from "~/components/ui/sonner";
import { CHROME_EXTENSION_URL, SUPPORT_DISCORD_URL } from "~/consts/internal";
import { auth } from "~/server/auth";

const SIDEBAR_SECTIONS = [
  {
    title: "Discord Checker",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
      },
      {
        title: "Import Tokens",
        href: "/import",
      },
      {
        title: "Accounts",
        href: "/accounts",
      },
      {
        title: "Collections",
        href: "/collections",
      },
    ],
    role: Role.CUSTOMER,
  },
  {
    title: "Admin",
    items: [
      {
        title: "Users",
        href: "/admin/users",
      },
    ],
    role: Role.ADMIN,
  },
  {
    title: "My Account",
    items: [
      {
        title: "Profile",
        href: "/profile",
      },
    ],
    role: Role.CUSTOMER,
  },
];

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  return (
    <>
      <div className="flex min-h-full flex-col">
        <div className="flex h-full">
          <main className="flex h-screen max-h-screen w-full flex-1 flex-col overflow-y-auto">
            <div className="flex max-h-full">
              <div className="hide-scrollbar h-screen max-h-screen w-64 overflow-auto border-r border-neutral-100/10 bg-blueish-grey-900">
                <div className="mb-2">
                  <div className="flex h-12 max-h-12 items-center border-b border-neutral-100/10 px-6">
                    <h4 className="mb-0 truncate text-lg">
                      {session.user.name ?? "Unnamed User"}
                    </h4>
                  </div>
                </div>
                <div className="-mt-1">
                  <nav
                    role="menu"
                    aria-label="Sidebar"
                    aria-orientation="vertical"
                  >
                    <ul>
                      {SIDEBAR_SECTIONS.filter(
                        ({ role }) =>
                          role === session.user.role ||
                          session.user.role === Role.ADMIN,
                      ).map(({ title, items }) => (
                        <div
                          className="border-b border-neutral-100/10 px-6 py-5"
                          key={`sidebar-section-${title.toLowerCase()}`}
                        >
                          <div className="mb-2 flex space-x-3 font-light">
                            <span className="w-full text-xs uppercase text-neutral-300">
                              {title}
                            </span>
                          </div>
                          <ul className="space-y-1">
                            {items.map((item) => (
                              <Link
                                href={item.href}
                                key={`sidebar-item-${item.title.toLowerCase()}`}
                                target="_self"
                                className="block"
                              >
                                <span className="group flex max-w-full cursor-pointer items-center space-x-2 py-1 font-normal outline-none focus-visible:z-10 focus-visible:ring-1">
                                  <span
                                    title={item.title}
                                    className="w-full truncate text-sm text-neutral-200 transition group-hover:text-neutral-100"
                                  >
                                    {item.title}
                                  </span>
                                </span>
                              </Link>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <div className="border-b border-neutral-100/10 px-6 py-5">
                        <SignOutSection />
                      </div>
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex h-12 max-h-12 items-center justify-between border-b border-neutral-100/10 px-5 py-2">
                  <div className="flex items-center justify-between w-full">
                    <div className="-ml-2 flex items-center text-sm">
                      <TbSlashes className="text-neutral-400" />
                      <NavRouterSegment />
                    </div>
                    <div className="flex items-center">
                      <Link
                        href={SUPPORT_DISCORD_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonVariants({
                          variant: "ghost",
                          size: "icon",
                        })}
                      >
                        <span className="sr-only">Join official Discord</span>
                        <PiDiscordLogoDuotone className="w-5 h-5" />
                      </Link>

                      <Link
                        href={CHROME_EXTENSION_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonVariants({
                          variant: "ghost",
                          size: "icon",
                        })}
                      >
                        <span className="sr-only">
                          Install Chrome Extension
                        </span>
                        <PiGoogleChromeLogoDuotone className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="relative flex-1 flex-grow overflow-auto scrollbar-thin">
                  <BackgroundGrid />
                  <div className="relative px-5 py-4">{children}</div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <ImportContext />
      <Toaster />
    </>
  );
}
