import { redirect } from "next/navigation";
import { z } from "zod";

export const metadata = {
  title: "Edit Collection | DTC-Web",
  robots: {
    index: false,
    follow: true,
  },
};

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  if (!z.string().cuid().safeParse(id).success) {
    redirect("/collections");
  }

  return <># WIP</>;
}
