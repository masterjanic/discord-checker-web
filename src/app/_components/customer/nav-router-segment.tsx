"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PiCaretRight } from "react-icons/pi";

import { toTitleCase } from "~/lib/discord-utils";

export default function NavRouterSegment() {
  const pathName = usePathname();

  return (
    <div className="flex items-center px-2 py-1 text-xs leading-5 text-neutral-200 focus:outline-none">
      {pathName
        .split("/")
        .slice(1)
        .map((segment, index) => {
          const href = `/${pathName
            .split("/")
            .slice(1, index + 2)
            .join("/")}`;
          return (
            <>
              <Link href={href}>{toTitleCase(segment)}</Link>
              {index !== pathName.split("/").length - 2 && (
                <PiCaretRight className="text-muted-foreground" />
              )}
            </>
          );
        })}
    </div>
  );
}
