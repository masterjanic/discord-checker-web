"use client";

import clsx from "clsx";
import { BsCreditCard, BsPaypal, BsQuestion } from "react-icons/bs";

import { api } from "~/trpc/react";

interface IAccountBillingProps {
  userId: string;
}

export default function AccountBilling({ userId }: IAccountBillingProps) {
  const [billing] = api.account.getBilling.useSuspenseQuery(userId);

  return (
    <>
      {billing.length === 0 && (
        <div className="grid place-items-center h-full p-4 text-neutral-200">
          <p>This account has no payment methods saved.</p>
        </div>
      )}

      {billing.map(
        ({ id, billing_address, type, default: isDefault, invalid }, index) => (
          <div
            className={clsx(
              "cursor-pointer border-x border-t border-blueish-grey-500/20 bg-blueish-grey-700 p-2 transition duration-300 hover:bg-blueish-grey-600/80",
              index === 0 && "rounded-t",
              index === billing.length - 1 && "rounded-b border-b",
            )}
            key={`payment-method-${id}`}
          >
            <div className="flex space-x-4">
              <div className="grid text-2xl place-items-center pointer-events-none p-2 select-none">
                {/**
                 * TODO: Add missing payment methods
                 */}
                {
                  [
                    <BsCreditCard />,
                    <BsPaypal />,
                    <BsQuestion />,
                    <BsQuestion />,
                    <BsQuestion />,
                    <BsQuestion />,
                    <BsQuestion />,
                    <BsQuestion />,
                  ][type]
                }
              </div>
              <div>
                <div className="flex items-center space-x-1.5 mb-1">
                  <p className="font-medium text-sm">{billing_address.name}</p>
                  {isDefault && (
                    <span className="bg-blurple border-blurple-legacy border rounded-md px-1.5 text-xs">
                      Default
                    </span>
                  )}
                  {invalid && (
                    <span className="bg-red-500 border border-red-400 rounded-md px-1.5 text-xs">
                      Invalid
                    </span>
                  )}
                </div>
                <div className="flex flex-col text-xs font-light text-neutral-200">
                  <p>
                    {(["line_1", "line_2", "postal_code", "city"] as const)
                      .map((key) => billing_address[key])
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <p>
                    {[billing_address.state, billing_address.country].join(
                      ", ",
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ),
      )}
    </>
  );
}
