"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiLoader } from "react-icons/fi";
import { PiTrashDuotone } from "react-icons/pi";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export default function CreateApiKeyDialog({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogTrigger>) {
  const [isOpen, setIsOpen] = useState(false);

  const formSchema = z.object({
    name: z.string().min(1).max(32),
    allowedIps: z.array(z.string().ip()).min(1).max(10),
    expiresAt: z
      .date()
      .refine(
        (date) => date.getTime() > Date.now(),
        "Expiration date must be in the future.",
      ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      allowedIps: [""],
      expiresAt: new Date(),
    },
  });

  const utils = api.useUtils();
  const { mutateAsync: createKey, isPending: isCreatingKey } =
    api.user.developer.createKey.useMutation({
      onSettled: async () => {
        await utils.user.developer.getKeys.invalidate();
      },
      onSuccess: () => {
        setIsOpen(false);
        form.reset();
      },
    });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createKey(values);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild {...props}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-screen overflow-y-scroll scrollbar-none">
        <DialogHeader>
          <DialogTitle>New API Key</DialogTitle>
          <DialogDescription>
            Create a new API Key for external applications or your own projects.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name:</FormLabel>
                  <FormControl>
                    <Input placeholder="My API key" maxLength={32} {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the display name for your API key.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              {form.getValues("allowedIps").map((_, index) => (
                <FormField
                  control={form.control}
                  key={index}
                  name={`allowedIps.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{index === 0 ? "Allowed IPs:" : ""}</FormLabel>
                      {index === 0 && (
                        <FormDescription>
                          Only requests from these IPs are allowed.
                        </FormDescription>
                      )}
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Input placeholder="IP address" {...field} />
                          <Button
                            type="button"
                            variant="default"
                            size="icon"
                            className="bg-red-600 hover:bg-red-700"
                            disabled={index === 0}
                            onClick={async () => {
                              const current = form.getValues("allowedIps");
                              form.setValue(
                                "allowedIps",
                                current.filter((_, i) => i !== index),
                              );
                              await form.trigger("allowedIps");
                            }}
                          >
                            <PiTrashDuotone />
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="mt-2"
                disabled={form.getValues("allowedIps").length >= 5}
                onClick={async () => {
                  form.setValue("allowedIps", [
                    ...form.getValues("allowedIps"),
                    "",
                  ]);
                  await form.trigger("allowedIps");
                }}
              >
                Add another IP
              </Button>
            </div>

            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="mb-1">Expiration Date:</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="flex flex-col w-auto p-2 space-y-2"
                      align="start"
                    >
                      <Select
                        onValueChange={async (value: string) => {
                          form.setValue(
                            "expiresAt",
                            addDays(new Date(), parseInt(value)),
                          );
                          await form.trigger("expiresAt");
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="7">In a week</SelectItem>
                          <SelectItem value="30">In a month</SelectItem>
                          <SelectItem value="90">In 3 months</SelectItem>
                        </SelectContent>
                      </Select>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Your API key will be disabled after this date.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6">
              <Button
                type="submit"
                disabled={
                  isCreatingKey ||
                  (form.formState.isDirty && !form.formState.isValid)
                }
              >
                {isCreatingKey && <FiLoader className="animate-spin mr-2" />}
                <span>Create API Key</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
