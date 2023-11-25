/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').options & import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */
const config = {
  plugins: [
    "prettier-plugin-tailwindcss",
    "@ianvs/prettier-plugin-sort-imports",
  ],
  importOrder: ["<THIRD_PARTY_MODULES>", "", "^~/", "^[.][.]/", "^[.]/"],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "5.3.2",
};

export default config;
