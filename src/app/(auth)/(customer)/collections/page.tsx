import { Suspense } from "react";

import CollectionOverview from "~/app/(auth)/(customer)/collections/collection-overview";
import SkeletonCollectionOverview from "~/app/(auth)/(customer)/collections/skel-collection-overview";
import { generateMetadata } from "~/lib/metadata";

export const metadata = generateMetadata({
  title: "Manage Collections",
  url: "/collections",
  robots: {
    index: false,
    follow: true,
  },
});

export default function Page() {
  return (
    <>
      <div className="mb-4 leading-[15px]">
        <h1 className="text-xl font-bold">Collections</h1>
        <span className="text-base text-neutral-300">
          Collections are a new way to organize your accounts. <br /> You can
          create as many collections as you want and add as many accounts as you
          want to them.
        </span>
      </div>

      <Suspense fallback={<SkeletonCollectionOverview />}>
        <CollectionOverview />
      </Suspense>
    </>
  );
}
