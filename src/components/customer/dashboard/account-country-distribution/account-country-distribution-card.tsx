"use client";

import { ResponsiveChoroplethCanvas } from "@nivo/geo";

import HelpTooltip from "~/components/common/help-tooltip";
import TitledCard from "~/components/common/titled-card";
import countries from "~/consts/world_countries.json";
import { api } from "~/trpc/react";

export default function AccountCountryDistributionCard() {
  const [distribution] = api.dashboard.getCountryDistribution.useSuspenseQuery(
    undefined,
    {
      refetchInterval: 30_000,
    },
  );

  return (
    <TitledCard
      title="Country Overview"
      extra={
        <HelpTooltip>
          Shows accounts grouped by their selected locale
        </HelpTooltip>
      }
      className="h-full"
    >
      <div className="w-full h-[600px] overflow-hidden">
        <ResponsiveChoroplethCanvas
          data={distribution}
          features={countries.features}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          // Descending order of shades
          colors={[
            "#5159b2",
            "#515abf",
            "#515bcc",
            "#515cd8",
            "#505ee5",
            "#505ff2",
            "#5060ff",
          ]}
          domain={[
            Math.max(...distribution.map((country) => country.value)) * 1.1,
            0,
          ]}
          unknownColor="#C6CFE6"
          label="properties.name"
          projectionTranslation={[0.5, 0.5]}
          borderWidth={0.5}
          borderColor="#000"
          theme={{
            tooltip: {
              container: {
                background: "#0B1324",
                border: "1px solid #202C4A",
                borderRadius: "6px",
                fontSize: 12,
              },
              chip: {
                borderRadius: "6px",
              },
            },
          }}
        />
      </div>
    </TitledCard>
  );
}
