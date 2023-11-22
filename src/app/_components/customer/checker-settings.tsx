import SwitchCategory from "~/app/_components/common/switch-category";
import { type ICheckerSettings } from "~/hooks/useImporter";

interface ICheckerSettingsProps {
  settings: ICheckerSettings;
  handleChange: (key: keyof ICheckerSettings, value: boolean | number) => void;
}

export default function CheckerSettings({
  settings,
  handleChange,
}: ICheckerSettingsProps) {
  return (
    <div className="mt-12">
      <div className="mb-4 leading-[15px]">
        <h2 className="text-xl font-bold">Checker Settings</h2>
        <span className="text-base text-neutral-300">
          Configure the behavior of the checker
        </span>
      </div>

      <div className="flex flex-col gap-6">
        <SwitchCategory
          name="Support Old Token Format"
          description="Tokens with a HMAC length of 27 are considered legacy tokens"
          checked={settings.includeLegacy}
          onChange={(newValue) => handleChange("includeLegacy", newValue)}
        />

        <SwitchCategory
          name="Remove Duplicate Accounts"
          description="Removes tokens with the same user id from the list"
          isNew={true}
          checked={settings.removeDuplicates}
          onChange={(newValue) => handleChange("removeDuplicates", newValue)}
        />
      </div>
    </div>
  );
}
