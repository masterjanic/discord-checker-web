"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type ApiKey } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiLoader } from "react-icons/fi";
import { PiTrashDuotone } from "react-icons/pi";
import { z } from "zod";

import { Button } from "~/components/ui/button";
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
import { api } from "~/trpc/react";

export default function EditApiKeyDialog({
  keyData: key,
  children,
  ...props
}: { keyData: ApiKey } & React.ComponentPropsWithoutRef<typeof DialogTrigger>) {
  const [isOpen, setIsOpen] = useState(false);

  const formSchema = z.object({
    name: z.string().min(1).max(32),
    allowedIps: z.array(z.string().ip()).min(1).max(10),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: key.name,
      allowedIps: key.allowedIps,
    },
  });

  const utils = api.useUtils();
  const { mutateAsync: updateKey, isLoading: isUpdatingKey } =
    api.user.developer.updateKey.useMutation({
      onSettled: async () => {
        await utils.user.developer.getKeys.invalidate();
      },
      onSuccess: () => {
        setIsOpen(false);
        form.reset();
      },
    });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await updateKey({ id: key.id, ...values });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild {...props}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-screen overflow-y-scroll scrollbar-none">
        <DialogHeader>
          <DialogTitle>Edit API Key</DialogTitle>
          <DialogDescription>
            You can update the name and allowed IPs of your API Key.{" "}
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

            <DialogFooter className="mt-6">
              <Button
                type="submit"
                disabled={
                  isUpdatingKey ||
                  (form.formState.isDirty && !form.formState.isValid) ||
                  !form.formState.isDirty
                }
              >
                {isUpdatingKey && <FiLoader className="animate-spin mr-2" />}
                <span>Update API Key</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
