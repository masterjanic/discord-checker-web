import { type Config } from "tailwindcss";
import { fontFamily, screens } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        "blueish-grey-500": "#425B99",
        "blueish-grey-600": "#202C4A",
        "blueish-grey-700": "#111B36",
        "blueish-grey-800": "#0B1324",
        "blueish-grey-900": "#0A1020",
        "neutral-100": "#FFFFFF",
        "neutral-200": "#D4DDF2",
        "neutral-300": "#C0CDEC",
        "neutral-400": "#C6CFE6",
        "neutral-900": "#000000",
        dark: "#23272A",
        "dark-legacy": "#4E5D94",
        blurple: "#5865F2",
        "blurple-dark": "#454FBF",
        "blurple-legacy": "#7289DA",
      },
      fontFamily: {
        sans: ["var(--font-poppins)", ...fontFamily.sans],
      },
      screens: {
        xs: "420px",
        ...screens,
      },
      spacing: {
        "navigation-height": "var(--navigation-height)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
} satisfies Config;
