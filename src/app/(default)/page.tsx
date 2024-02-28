import HomeAccountDemo from "~/components/home/home-account-demo";
import HomeHeroSection from "~/components/home/home-hero-section";
import { auth } from "~/server/auth";

export default async function Page() {
  const session = await auth();

  return (
    <>
      <HomeHeroSection session={session} />
      <HomeAccountDemo />
    </>
  );
}
