import { Switch, type SwitchProps } from "@headlessui/react";
import clsx from "clsx";
import { type ElementType } from "react";

interface ISwitchCategoryProps extends SwitchProps<ElementType> {
  name: string;
  description: string;
  isNew?: boolean;
}

export default function SwitchCategory({
  name,
  description,
  checked,
  isNew,
  ...props
}: ISwitchCategoryProps) {
  return (
    <Switch.Group>
      <div className="flex items-center">
        <Switch
          checked={checked}
          className={clsx(
            "relative inline-flex h-6 w-11 items-center rounded-full",
            checked ? "bg-blurple" : "bg-blueish-grey-600",
          )}
          {...props}
        >
          <span
            className={clsx(
              "inline-block h-4 w-4 transform rounded-full bg-white transition",
              checked ? "translate-x-6" : "translate-x-1",
            )}
          />
        </Switch>
        <Switch.Label className="ml-4 flex flex-col space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-base font-medium">{name}</span>
            {isNew && (
              <span className="inline-flex items-center justify-center rounded-full bg-blurple px-2 py-1 text-xs font-medium leading-none text-white">
                New
              </span>
            )}
          </div>
          <span className="text-sm font-light text-neutral-300">
            {description}
          </span>
        </Switch.Label>
      </div>
    </Switch.Group>
  );
}
