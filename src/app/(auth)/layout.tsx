import Link from "next/link";
import { TbSlashes } from "react-icons/tb";
import BackgroundGrid from "~/app/_components/common/background-grid";
import SignOutSection from "~/app/_components/common/sign-out";
import NavRouterSegment from "~/app/_components/customer/nav-router-segment";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";

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
    ],
  },
  {
    title: "My Account",
    items: [
      {
        title: "Profile",
        href: "/profile",
      },
    ],
  },
];

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex h-full">
        <main className="flex h-screen max-h-screen w-full flex-1 flex-col overflow-y-auto">
          <div className="flex max-h-full">
            <div className="hide-scrollbar h-screen max-h-screen w-64 overflow-auto border-r border-neutral-100/10 bg-blueish-grey-900">
              <div className="mb-2">
                <div className="flex h-12 max-h-12 items-center border-b border-neutral-100/10 px-6">
                  <h4 className="mb-0 truncate text-lg">{session.user.name}</h4>
                </div>
              </div>
              <div className="-mt-1">
                <nav
                  role="menu"
                  aria-label="Sidebar"
                  aria-orientation="vertical"
                >
                  <ul>
                    {SIDEBAR_SECTIONS.map(({ title, items }) => (
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
                <div className="-ml-2 flex items-center text-sm">
                  <TbSlashes className="text-neutral-400" />
                  <NavRouterSegment />
                </div>
              </div>
              <div className="relative flex-1 flex-grow overflow-auto">
                <BackgroundGrid />

                <div className="relative px-5 py-4">{children}</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
