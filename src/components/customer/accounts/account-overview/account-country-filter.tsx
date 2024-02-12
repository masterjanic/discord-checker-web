"use client";

import { CheckIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { DISCORD_LOCALES_MAP, getCountryNameByCode } from "~/consts/discord";
import useAccountsOverview from "~/hooks/useAccountsOverview";
import { cn } from "~/lib/utils";

export default function AccountCountryFilter() {
  const [isOpen, setIsOpen] = useState(false);
  const { filters, setFilter } = useAccountsOverview();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="flex items-center space-x-2"
        >
          {!!filters.locale ? (
            <Image
              width={27}
              height={18}
              src={`/images/locales/${filters.locale}.png`}
              alt={`Locale ${filters.locale}`}
              className="pointer-events-none select-none rounded"
            />
          ) : (
            <span>Country</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="end">
        <Command>
          <CommandInput
            className="caret-primary"
            placeholder="Search country..."
          />
          <CommandEmpty>No country found.</CommandEmpty>
          <CommandGroup className="overflow-y-scroll scrollbar-none max-h-64">
            {DISCORD_LOCALES_MAP.map(([locale, code]) => {
              const countryName = getCountryNameByCode(code);
              return (
                <CommandItem
                  key={`locale-select-${locale}`}
                  value={countryName}
                  onSelect={() => {
                    setFilter(
                      "locale",
                      filters.locale === locale ? "" : locale,
                    );
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <Image
                      width={27}
                      height={18}
                      src={`/images/locales/${locale}.png`}
                      alt={`Locale ${locale}`}
                      className="pointer-events-none select-none rounded"
                    />
                    <span>{countryName}</span>
                  </div>
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      locale !== filters.locale && "opacity-0",
                    )}
                  />
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
