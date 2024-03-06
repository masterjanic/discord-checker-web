import { notFound } from "next/navigation";

// TODO: Public Profiles 🌟
export default function Page({ params }: { params: { username: string } }) {
  notFound();

  return <></>;
}
