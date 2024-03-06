import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { generateMetadata as _generateMetadata } from "~/lib/metadata";
import { db } from "~/server/db";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const collection = await db.discordAccountCollection.findUnique({
    where: {
      id: params.id,
    },
    select: {
      name: true,
    },
  });
  if (!collection) {
    notFound();
  }

  return _generateMetadata({
    title: collection.name,
    url: `/collections/${params.id}`,
    robots: {
      index: false,
      follow: true,
    },
  });
}

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  if (!z.string().cuid().safeParse(id).success) {
    redirect("/collections");
  }

  return <># WIP</>;
}
