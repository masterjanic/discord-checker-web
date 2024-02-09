import { notFound } from "next/navigation";

// TODO: Public Profiles 🌟
export default function Page({ params }: { params: { username: string } }) {
  notFound();

  const decodedUsername = decodeURIComponent(params.username);
  const username = decodedUsername.replace("@", "");
  return (
    <div className="py-16 lg:py-20">
      <p>{username}</p>
      <pre>{JSON.stringify({}, null, 2)}</pre>
    </div>
  );
}
