import Link from "next/link";

import BackgroundGrid from "~/components/common/background-grid";
import Container from "~/components/common/container";
import Footer from "~/components/common/footer";
import Navbar from "~/components/common/nav/navbar";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { getServerAuthSession } from "~/server/auth";

export const metadata = {
  title: "Oops! Site not found!",
  description: "The page you are looking for seems to not exist.",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function Page() {
  const session = await getServerAuthSession();

  return (
    <>
      <Navbar session={session} />
      <div className="relative min-h-[calc(100vh-73px)] grid place-items-center">
        <BackgroundGrid />
        <Container className="relative grid place-items-center py-12">
          <span className="text-9xl font-bold text-primary mb-4 tracking-tight font-mono">
            404
          </span>
          <h1 className="text-2xl font-semibold">Page not found</h1>
          <p className="mt-2 text-base">
            The page you are looking for seems to not exist.
          </p>

          <Link
            href="/"
            className={cn(buttonVariants({ variant: "default" }), "mt-12")}
          >
            Back to home
          </Link>
        </Container>
      </div>
      <Footer />
    </>
  );
}
