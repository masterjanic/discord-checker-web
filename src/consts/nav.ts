import { type IconType } from "react-icons";
import {
  PiClockDuotone,
  PiDiscordLogoDuotone,
  PiGoogleChromeLogoDuotone,
  PiInfoDuotone,
  PiShareNetworkDuotone,
} from "react-icons/pi";

export const NAV_LINKS = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Features",
    components: [
      {
        title: "Chrome Addon",
        href: "/features/chrome-addon",
        description:
          "Fast login to your stored accounts with the Chrome extension.",
        icon: PiGoogleChromeLogoDuotone as IconType,
      },
      {
        title: "Discord Integration",
        href: "/features/discord-integration",
        description: "Import and export your accounts to and from Discord.",
        icon: PiDiscordLogoDuotone as IconType,
      },
      {
        title: "Interval Token Checking",
        href: "/features/interval-token-checking",
        description: "Automatically recheck your accounts at a set interval.",
        icon: PiClockDuotone as IconType,
      },
      {
        title: "Advanced Account Details",
        href: "/features/advanced-account-details",
        description: "Get the most out of your accounts with advanced details.",
        icon: PiInfoDuotone as IconType,
      },
      {
        title: "API Access",
        href: "/features/api-access",
        description: "Access your accounts programmatically with the API.",
        icon: PiShareNetworkDuotone as IconType,
      },
    ],
  },
  {
    title: "Pricing",
    href: "/pricing",
  },
  {
    title: "Leaderboard",
    href: "/leaderboard",
  },
  {
    title: "Changelog",
    href: "/changelog",
  },
];
