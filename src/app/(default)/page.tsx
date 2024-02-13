import HomeAccountDemo from "~/components/home/home-account-demo";
import HomeHeroSection from "~/components/home/home-hero-section";
import { getServerAuthSession } from "~/server/auth";

export default async function Page() {
  const session = await getServerAuthSession();

  return (
    <>
      <HomeHeroSection session={session} />
      <HomeAccountDemo />
    </>
  );
}
