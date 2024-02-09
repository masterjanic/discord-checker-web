import Link from "next/link";
import { PiInfoDuotone } from "react-icons/pi";

import { CHROME_EXTENSION_URL } from "~/consts/internal";

export default function ChromeExtensionBanner() {
  return (
    <Link
      href={CHROME_EXTENSION_URL}
      className="hidden group mb-4 lg:flex items-center rounded-lg bg-primary border px-3 py-2 transition duration-300 hover:bg-primary/90"
      target="_blank"
      rel="noopener noreferrer"
    >
      <PiInfoDuotone className="h-6 w-6 text-blurple flex-shrink-0" />
      <p className="ml-2 leading-tight">
        Click here to check out the new Chrome extension to fast login into
        accounts.
      </p>
    </Link>
  );
}
