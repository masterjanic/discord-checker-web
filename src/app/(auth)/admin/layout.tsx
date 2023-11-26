import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

import { getServerAuthSession } from "~/server/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  if (session?.user.role !== Role.ADMIN) {
    redirect("/");
  }

  return <>{children}</>;
}
