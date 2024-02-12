import ImportFileZone from "~/components/customer/import/import-file-zone";
import ImportSettingsCard from "~/components/customer/import/import-settings-card";
import { generateMetadata } from "~/lib/metadata";

export const metadata = generateMetadata({
  title: "Token Import",
  description: "Import new Discord tokens to your account.",
  url: "/import",
  robots: {
    index: false,
    follow: true,
  },
});

export default function Page() {
  return (
    <>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <ImportFileZone />
        <ImportSettingsCard />
      </div>
    </>
  );
}
