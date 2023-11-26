import { redirect } from "next/navigation";

import { isValidSnowflake } from "~/lib/discord-utils";
import { getServerAuthSession } from "~/server/auth";

export const metadata = {
  title: "Server Overview | DTC-Web",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  if (!isValidSnowflake(id)) {
    redirect("/accounts");
  }

  const session = await getServerAuthSession();

  return <></>;
}
