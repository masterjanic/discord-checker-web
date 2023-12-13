import Link from "next/link";
import { FiInfo } from "react-icons/fi";

import { CHROME_EXTENSION_URL } from "~/consts/internal";

export default function ChromeExtensionBanner() {
  return (
    <Link
      href={CHROME_EXTENSION_URL}
      className="group mb-6 flex items-center rounded border border-blueish-grey-600/80 bg-blueish-grey-700 px-3 py-2 transition duration-300 hover:bg-blueish-grey-600/60"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FiInfo className="h-6 w-6 text-blurple" />
      <span className="ml-4 text-neutral-100">
        Click here to check out the new Chrome extension to fast login into
        accounts.
      </span>
    </Link>
  );
}
