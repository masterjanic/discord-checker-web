"use client";

import clsx from "clsx";
import { type FieldProps, type FormikErrors, type FormikValues } from "formik";

interface InputFieldProps extends FieldProps {
  className?: string;
  isTextArea?: boolean;
}

export const inputStyles = {
  input:
    "disabled:opacity-50 w-full rounded-xl border border-blueish-grey-600/80 bg-blueish-grey-800/50 px-5 py-3 text-sm text-neutral-100 transition-colors duration-200 focus:border-blueish-grey-500/80 focus:outline-none",
  error: "border-red-400/60 focus:border-red-400/80",
};

const hasError = (
  errors: FormikErrors<FormikValues>,
  name: string,
): boolean => {
  const keys = name.split(".");

  let current = errors;

  for (const key of keys) {
    // Check if the key is an array index
    if (key.match(/^\d+$/)) {
      const index = parseInt(key, 10);

      if (!Array.isArray(current) || !current[index]) {
        return false;
      }

      current = current[index] as object;
    } else {
      if (current[key] === undefined) {
        return false;
      }

      current = current[key] as object;
    }
  }

  return current !== undefined;
};

export default function InputField({
  className,
  isTextArea,
  field,
  form: { errors },
  ...props
}: InputFieldProps) {
  return (
    <>
      {!isTextArea ? (
        <input
          {...field}
          {...props}
          className={clsx(
            inputStyles.input,
            hasError(errors, field.name) && inputStyles.error,
            className,
          )}
        />
      ) : (
        <textarea
          {...field}
          {...props}
          className={clsx(
            inputStyles.input,
            hasError(errors, field.name) && inputStyles.error,
            className,
          )}
        />
      )}
    </>
  );
}
