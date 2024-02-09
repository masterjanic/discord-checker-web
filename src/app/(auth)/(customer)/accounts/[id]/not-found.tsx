import Link from "next/link";

import Container from "~/components/common/container";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export const metadata = {
  title: "Account not found",
  description: "The account you are looking for seems to not exist.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <div className="pt-32 grid place-items-center">
      <Container className="text-center">
        <span className="text-9xl font-bold text-primary mb-4 tracking-tight font-mono">
          404
        </span>
        <h1 className="text-2xl font-semibold">Account not found</h1>
        <p className="mt-2 text-base max-w-md">
          The account you are looking for seems to not exist, because it became
          invalid or was deleted.
        </p>

        <Link
          href="/accounts"
          className={cn(buttonVariants({ variant: "default" }), "mt-12")}
        >
          Go back
        </Link>
      </Container>
    </div>
  );
}
