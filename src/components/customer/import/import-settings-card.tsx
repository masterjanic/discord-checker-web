"use client";

import HelpTooltip from "~/components/common/help-tooltip";
import TitledCard from "~/components/common/titled-card";
import { Slider } from "~/components/ui/slider";
import { Switch } from "~/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import useTokenImport from "~/hooks/useTokenImport";

export default function ImportSettingsCard() {
  const { settings, updateSetting } = useTokenImport();

  return (
    <TitledCard
      title="Import Settings"
      extra={
        <HelpTooltip>
          You can also change the settings during the import process.
        </HelpTooltip>
      }
    >
      <div className="space-y-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between rounded-lg gap-4 border p-3 shadow-sm">
          <div className="max-w-md space-y-0.5">
            <h3 className="text-base font-medium">Support Old Token Format</h3>
            <p className="text-xs font-light">
              When enabled, the old token format will be supported. Tokens with
              a{" "}
              <TooltipProvider>
                <Tooltip>
                  <TooltipContent>
                    Last part of the token after the second dot (.)
                  </TooltipContent>
                  <TooltipTrigger className="underline decoration-dotted decoration-primary">
                    HMAC
                  </TooltipTrigger>
                </Tooltip>
              </TooltipProvider>{" "}
              length of 27 are considered legacy tokens.
            </p>
          </div>

          <Switch
            checked={settings.includeLegacy}
            onCheckedChange={(value) => updateSetting("includeLegacy", value)}
          />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between rounded-lg gap-4 border p-3 shadow-sm">
          <div className="max-w-md space-y-0.5">
            <h3 className="text-base font-medium">Remove Duplicate Accounts</h3>
            <p className="text-xs font-light">
              This option will remove any duplicate accounts with the same user
              id from the import list.
            </p>
          </div>

          <Switch
            checked={settings.removeDuplicates}
            onCheckedChange={(value) =>
              updateSetting("removeDuplicates", value)
            }
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between rounded-lg gap-4 border p-3 shadow-sm">
          <div className="max-w-md space-y-0.5">
            <h3 className="text-base font-medium">Additional Delay</h3>
            <p className="text-xs font-light">
              Add some delay between each request. Normally this is not needed
              since rate limits are handled automatically.
            </p>
          </div>

          <div className="flex flex-col space-y-2 w-full items-end">
            <Slider
              defaultValue={[settings.delay]}
              onValueChange={([value]) => updateSetting("delay", value ?? 0)}
              step={100}
              max={3000}
              className="max-w-[250px]"
            />
            <p className="text-xs font-light text-muted-foreground">
              {settings.delay} ms
            </p>
          </div>
        </div>
      </div>
    </TitledCard>
  );
}
