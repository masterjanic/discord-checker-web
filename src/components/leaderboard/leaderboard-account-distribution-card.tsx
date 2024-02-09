"use client";

import { ResponsiveContainer, Tooltip, Treemap } from "recharts";

import { Card } from "~/components/ui/card";
import { api } from "~/trpc/react";

export default function LeaderboardAccountDistributionCard() {
  const [data] = api.public.leaderboard.getAccountDistribution.useSuspenseQuery(
    undefined,
    {
      refetchInterval: 30_000,
    },
  );

  return (
    <Card className="bg-muted/30 p-6">
      <h3 className="font-semibold text-lg">Account Distribution</h3>
      <p className="text-sm font-light">
        Shows the distribution of accounts across the top users and everyone
        else.
      </p>

      <div className="w-full h-96 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={data}
            dataKey="count"
            aspectRatio={4 / 3}
            stroke="#fff"
            className="fill-primary"
          >
            <Tooltip
              cursor={{ fill: "rgba(0, 0, 0, 0.3)" }}
              content={({ active, payload }) => {
                if (active && payload?.length) {
                  const tooltipPayload = payload[0]!;
                  return (
                    <Card className="p-3">
                      <h5 className="uppercase text-muted-foreground text-xs">
                        {tooltipPayload.value} Accounts
                      </h5>
                      <p className="text-lg font-semibold">
                        {tooltipPayload.name}
                      </p>
                    </Card>
                  );
                }

                return null;
              }}
            />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
