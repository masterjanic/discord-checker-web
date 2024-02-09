import HomeHeroSection from "~/components/home/home-hero-section";
import { getServerAuthSession } from "~/server/auth";

export default async function Page() {
  const session = await getServerAuthSession();

  return (
    <>
      <HomeHeroSection session={session} />
    </>
  );
}
