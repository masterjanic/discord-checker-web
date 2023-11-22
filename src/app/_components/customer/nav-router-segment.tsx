"use client";

import { usePathname } from "next/navigation";
import { toTitleCase } from "~/lib/discord-utils";

export default function NavRouterSegment() {
  const pathName = usePathname();

  return (
    <span className="block px-2 py-1 text-xs leading-5 text-neutral-200 focus:outline-none ">
      {pathName
        .split("/")
        .slice(1)
        .map((segment) => toTitleCase(segment))
        .join(" > ")}
    </span>
  );
}
