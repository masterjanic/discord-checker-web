"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip } from "recharts";

import HelpTooltip from "~/components/common/help-tooltip";
import TitledCard from "~/components/common/titled-card";
import { Card } from "~/components/ui/card";
import { api } from "~/trpc/react";

export default function AccountsOverTimeCard() {
  const [data] = api.dashboard.getAccountsOverTime.useSuspenseQuery(undefined, {
    refetchInterval: 30_000,
  });

  return (
    <TitledCard
      title="Accounts over Time"
      extra={
        <HelpTooltip>
          Shows the number of accounts created over the past 14 days
        </HelpTooltip>
      }
    >
      <div className="h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <Bar dataKey="count" className="fill-primary" minPointSize={1} />
            <Tooltip
              cursor={{ fill: "rgba(0, 0, 0, 0.3)" }}
              content={({ active, payload }) => {
                if (active && payload?.length) {
                  return (
                    <Card className="p-3">
                      <h5 className="uppercase text-muted-foreground text-xs">
                        Accounts
                      </h5>
                      <p className="text-lg font-semibold">
                        {payload[0]!.value}
                      </p>
                    </Card>
                  );
                }

                return null;
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </TitledCard>
  );
}
