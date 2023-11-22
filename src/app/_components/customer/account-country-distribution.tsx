"use client";

import { api } from "~/trpc/react";
import { ResponsiveChoroplethCanvas } from "@nivo/geo";

import countries from "~/consts/world_countries.json";

export default function AccountCountryDistribution() {
  const [distribution] = api.dashboard.getCountryDistribution.useSuspenseQuery(
    undefined,
    {
      refetchInterval: 30_000,
    },
  );

  return (
    <ResponsiveChoroplethCanvas
      data={distribution}
      features={countries.features}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      colors={[
        "#5159b2",
        "#515abf",
        "#515bcc",
        "#515cd8",
        "#505ee5",
        "#505ff2",
        "#5060ff",
      ]} // Descending order of red shades
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
            fontSize: 12,
          },
        },
      }}
    />
  );
}
