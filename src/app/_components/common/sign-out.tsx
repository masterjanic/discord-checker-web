"use client";

import { signOut } from "next-auth/react";
import { FiLogOut } from "react-icons/fi";

export default function SignOutSection() {
  return (
    <ul className="space-y-1">
      <li
        role="menuitem"
        className="ring-foreground-muted group flex cursor-pointer items-center space-x-3 border-neutral-100 py-1 font-normal outline-none focus-visible:z-10 focus-visible:ring-1"
        onClick={() => signOut()}
      >
        <div className="min-w-fit truncate text-sm text-neutral-300 transition group-hover:text-neutral-200">
          <FiLogOut />
        </div>
        <span className="w-full truncate text-sm text-neutral-200 transition group-hover:text-neutral-100">
          Logout
        </span>
      </li>
    </ul>
  );
}
