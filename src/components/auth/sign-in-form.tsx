"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, type getProviders } from "next-auth/react";
import React from "react";
import { useForm } from "react-hook-form";
import { PiEnvelopeDuotone } from "react-icons/pi";
import { SiDiscord, SiGithub } from "react-icons/si";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";

export default function SignInForm({
  providers,
}: {
  providers: Awaited<ReturnType<typeof getProviders>>;
}) {
  const providerStyles = {
    discord: {
      icon: SiDiscord,
      style: "bg-[#5865F2] hover:bg-[#454FBF]",
    },
    github: {
      icon: SiGithub,
      style: "bg-neutral-100 hover:bg-neutral-200 text-neutral-900",
    },
  } as const;

  const formSchema = z.object({ email: z.string().email() });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await signIn("email", values);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl className="!mt-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PiEnvelopeDuotone className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      className="pl-8 caret-primary"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isDirty && !form.formState.isValid}
          >
            Sign In
          </Button>
        </form>
      </Form>
      <Separator className="my-4" />
      <div className="text-center space-y-2.5">
        <small className="text-muted-foreground font-light">Sign in with</small>
        <div className="flex items-center justify-center space-x-3">
          {Object.entries(providerStyles).map(([key, { style, icon }]) => {
            return (
              <button
                key={key}
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-full transition duration-300 disabled:opacity-50",
                  style,
                )}
                onClick={() => signIn(key)}
                disabled={!providers || !(key in providers)}
              >
                <span className="sr-only">
                  Sign in with {key.toUpperCase()}
                </span>
                {React.createElement(icon)}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
