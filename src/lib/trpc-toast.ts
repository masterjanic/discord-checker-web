import { toast } from "sonner";

import { isTRPCClientError } from "~/trpc/react";

interface TRPCToastConfig {
  promise: Parameters<typeof toast.promise>[0];
  config: Parameters<typeof toast.promise>[1] & {
    errorDescription?: string;
    successDescription?: string;
  };
}

export const trpcToast = ({ promise, config }: TRPCToastConfig) => {
  toast.promise(promise, {
    ...config,
    description: (data) => {
      if (data instanceof Error) {
        if (isTRPCClientError(data)) {
          const shape = data.shape;
          if (shape?.data.zodError) {
            const zodError = shape.data.zodError;
            return "TODO: Zod error message";
          }
        }

        return (
          config.errorDescription ??
          "An error occurred while processing the action."
        );
      }

      return (
        config.successDescription ?? "The action was processed successfully."
      );
    },
  });
};
