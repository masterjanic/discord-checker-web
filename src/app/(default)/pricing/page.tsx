import Container from "~/components/common/container";
import PricingHero from "~/components/pricing/pricing-hero";
import { Separator } from "~/components/ui/separator";
import { generateMetadata } from "~/lib/metadata";
import { getServerAuthSession } from "~/server/auth";

export const metadata = generateMetadata({
  title: "View Pricing",
  description:
    "Start checking your Discord tokens for free, view analytics and manage them easily. Upgrade to get access to more features.",
  url: "/pricing",
});

export default async function Page() {
  const session = await getServerAuthSession();

  return (
    <div className="py-16 lg:py-20">
      <PricingHero session={session} />
      <Separator className="my-16 lg:my-20" />
      <Container>
        <div className="text-center">
          <h2 id="compare-plans" className="text-3xl scroll-m-20">
            Compare Plans
          </h2>
          <p className="mt-4 mb-8 lg:mb-16 text-lg text-neutral-200">
            Start checking your Discord tokens for free and upgrade to get
            access to more features.
          </p>
        </div>
      </Container>
    </div>
  );
}
