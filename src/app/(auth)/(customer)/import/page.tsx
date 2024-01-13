import { Suspense } from "react";

import TokenInput from "~/app/_components/customer/token-input";
import SkeletonDefault from "~/app/_components/skeletons/skeleton-default";
import { generateMetadata } from "~/lib/metadata";

export const metadata = generateMetadata({
  title: "Token Import",
  url: "/import",
  robots: {
    index: false,
    follow: true,
  },
});

export default function Page() {
  return (
    <>
      <div className="mb-4 leading-[15px]">
        <h1 className="text-xl font-bold">Token Import</h1>
        <span className="text-base text-neutral-300">
          You can import as many tokens as you wish. The checked tokens will be
          added to your account.
        </span>
      </div>

      <Suspense fallback={<SkeletonDefault className="!h-[649px]" />}>
        <TokenInput />
      </Suspense>
    </>
  );
}
