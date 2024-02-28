"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { trpcToast } from "~/lib/trpc-toast";
import { api } from "~/trpc/react";

export default function AccountExportMultiDialog({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogTrigger>) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync: exportAccounts, isPending: isExporting } =
    api.account.export.useMutation({
      onSuccess: (result) => {
        if (!result) return;

        const fileName = `tokens-${new Date().getTime()}.${result.ext}`;
        const blob = new Blob([result.data]);

        const downloadAnchor = window.document.createElement("a");
        downloadAnchor.href = window.URL.createObjectURL(blob);
        downloadAnchor.download = fileName;
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        document.body.removeChild(downloadAnchor);
      },
    });

  const formSchema = z.object({
    fileType: z.enum(["txt", "csv", "json"]),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsOpen(false);
    form.reset();

    trpcToast({
      promise: exportAccounts(values),
      config: {
        loading: "Exporting Accounts...",
        success: "Accounts Exported",
        error: "Failed to Export Accounts",
        successDescription: "Your accounts have been exported.",
        errorDescription: "There was an error trying to export your accounts.",
      },
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild {...props}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-screen overflow-y-scroll scrollbar-none">
        <DialogHeader>
          <DialogTitle>Export Accounts</DialogTitle>
          <DialogDescription>
            Export all available accounts to a file.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="fileType"
              render={({ field }) => (
                <FormItem className="flex flex-col md:flex-row md:items-center justify-between rounded-lg gap-4 border p-3 shadow-sm">
                  <div className="max-w-md space-y-0.5">
                    <FormLabel>Filetype</FormLabel>
                    <FormDescription>
                      Select your preferred file type.
                    </FormDescription>
                  </div>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="max-w-[180px]">
                        <SelectValue placeholder="Select a filetype..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Files</SelectLabel>
                        <SelectItem value="txt">Plain Text (.txt)</SelectItem>
                        <SelectItem value="json">JSON (.json)</SelectItem>
                        <SelectItem value="csv">CSV (.csv)</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <Separator className="my-4" />
            <DialogFooter>
              <Button type="submit" disabled={isExporting}>
                Export
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
