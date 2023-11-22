import { Suspense } from "react";
import TokenInput from "~/app/_components/customer/token-input";

export const metadata = {
  title: "Token Import - Discord Token Checker",
  robots: {
    index: false,
    follow: true,
  },
};

export default function Page() {
  return (
    <>
      <div className="leading-[15px]">
        <h1 className="text-xl font-bold">Token Import</h1>
        <span className="text-base text-neutral-300">
          You can import as many tokens as you wish. The checked tokens will be
          added to your account.
        </span>
      </div>

      <Suspense>
        <TokenInput />
      </Suspense>
    </>
  );
}
