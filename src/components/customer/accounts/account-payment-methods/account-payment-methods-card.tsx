"use client";

import React from "react";
import { BiLogoVenmo } from "react-icons/bi";
import {
  PiCreditCardDuotone,
  PiPaypalLogoDuotone,
  PiQuestionDuotone,
} from "react-icons/pi";
import { SiCashapp, SiKakao, SiKlarna } from "react-icons/si";

import HelpTooltip from "~/components/common/help-tooltip";
import TitledCard from "~/components/common/titled-card";
import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { toTitleCase } from "~/lib/discord-utils";
import { api } from "~/trpc/react";

// TODO: Add missing payment method icons
const PAYMENT_METHODS = [
  { name: "Credit Card", icon: PiCreditCardDuotone },
  { name: "PayPal", icon: PiPaypalLogoDuotone },
  { name: "Sofort", icon: SiKlarna },
  { name: "Przelewy24", icon: PiQuestionDuotone },
  { name: "Klarna", icon: SiKlarna },
  { name: "Paysafecard", icon: PiQuestionDuotone },
  { name: "GCash", icon: PiQuestionDuotone },
  { name: "CrabPay", icon: PiQuestionDuotone },
  { name: "Venmo", icon: BiLogoVenmo },
  { name: "GoPay", icon: PiQuestionDuotone },
  { name: "KaKao Pay", icon: SiKakao },
  { name: "Bancontact", icon: PiQuestionDuotone },
  { name: "EPS", icon: PiQuestionDuotone },
  { name: "iDeal", icon: PiQuestionDuotone },
  { name: "Cash App Pay", icon: SiCashapp },
];

// TODO: Payment Method Details Dialog
export default function AccountPaymentMethodsCard({
  userId,
}: {
  userId: string;
}) {
  const [billing] = api.account.getBilling.useSuspenseQuery(userId);

  return (
    <TitledCard
      title="Payment Methods"
      extra={
        <HelpTooltip>Shows saved payment methods for this account</HelpTooltip>
      }
    >
      {billing.length === 0 && (
        <div className="grid place-items-center h-full p-4">
          <p className="text-center font-light">
            This account has no payment methods saved.
          </p>
        </div>
      )}

      <div className="space-y-2">
        {billing.map((method) => {
          const { billing_address } = method;

          const line_1 = (["line_1", "line_2", "postal_code", "city"] as const)
            .map((key) => billing_address[key])
            .filter(Boolean)
            .map(toTitleCase)
            .join(", ");
          const paymentMethod = PAYMENT_METHODS[method.type - 1];

          return (
            <Card className="px-3 py-4">
              <div className="flex items-center space-x-2.5">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex-shrink-0">
                        {React.createElement(
                          paymentMethod?.icon ?? PiQuestionDuotone,
                          {
                            className: "h-6 w-6",
                          },
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {paymentMethod?.name ?? "Unknown Payment Method"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <div className="tracking-tight">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-sm">
                      {billing_address.name}
                    </p>
                    <div className="flex items-center space-x-1.5">
                      {method.default && (
                        <Badge variant="default" className="py-0 px-1.5">
                          Default
                        </Badge>
                      )}
                      {method.invalid && (
                        <Badge variant="destructive" className="py-0 px-1.5">
                          Invalid
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-xs font-light">{line_1}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </TitledCard>
  );
}
