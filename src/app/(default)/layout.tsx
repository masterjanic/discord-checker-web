import "~/styles/globals.css";

import Footer from "~/components/common/footer";
import Navbar from "~/components/common/nav/navbar";
import { auth } from "~/server/auth";

export default async function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <>
      <Navbar session={session} />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
