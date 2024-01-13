import { notFound } from "next/navigation";

import { generateMetadata as _generateMetadata } from "~/lib/metadata";
import { db } from "~/server/db";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const user = await db.user.findUnique({
    where: {
      id: params.id,
    },
    select: {
      name: true,
    },
  });
  if (!user) {
    notFound();
  }

  return _generateMetadata({
    title: user.name ?? "Unnamed User",
    url: `/admin/users/${params.id}`,
    robots: {
      index: false,
      follow: true,
    },
  });
}

export default function Page() {
  return <></>;
}
