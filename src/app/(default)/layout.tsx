import "~/styles/globals.css";

import Footer from "~/components/common/footer";
import Navbar from "~/components/common/nav/navbar";
import { getServerAuthSession } from "~/server/auth";

export default async function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  return (
    <>
      <Navbar session={session} />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
