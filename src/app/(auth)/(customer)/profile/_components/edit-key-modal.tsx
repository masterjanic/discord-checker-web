"use client";

import { type ApiKey } from "@prisma/client";
import { Field, Form, Formik } from "formik";
import { FiSave, FiTrash } from "react-icons/fi";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

import Button from "~/app/_components/common/button";
import InputField from "~/app/_components/common/input-field";
import Modal, { type TModalProps } from "~/app/_components/common/modal";
import { api } from "~/trpc/react";

type TEditKeyModalProps = TModalProps & {
  keyData: ApiKey;
};

export default function EditKeyModal({
  keyData: key,
  ...props
}: TEditKeyModalProps) {
  const utils = api.useUtils();
  const { mutateAsync: updateKey, isLoading: isUpdatingKey } =
    api.user.developer.updateKey.useMutation({
      onSettled: async () => {
        await utils.user.developer.getKeys.invalidate();
        props.onClose(false);
      },
    });

  return (
    <Modal {...props}>
      <Modal.Head title="Edit API Key">
        You can update the name and allowed IPs of your API Key.
      </Modal.Head>

      <div className="mb-4 space-y-1">
        <span className="text-sm font-mono">{key.value}</span>

        <p className="text-xs text-neutral-200">
          Expiration: {key.expiresAt?.toLocaleString("en-US") ?? "never"}
        </p>
      </div>

      <Formik
        initialValues={{
          name: key.name,
          allowedIps: key.allowedIps,
        }}
        validationSchema={toFormikValidationSchema(
          z.object({
            name: z.string().min(1).max(32),
            allowedIps: z.array(z.string().ip()).min(1).max(10),
          }),
        )}
        onSubmit={(values) => updateKey({ id: key.id, ...values })}
      >
        {({ values, setFieldValue, isValid }) => (
          <Form>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm text-neutral-100">
                  Name:
                </label>
                <Field
                  name="name"
                  id="name"
                  component={InputField}
                  type="text"
                  placeholder="My API Key"
                  maxLength={32}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="allowedIps"
                  className="text-sm text-neutral-100"
                >
                  Allowed IPs:
                </label>

                {values.allowedIps.map((_, index) => (
                  <div
                    className="flex items-center gap-2"
                    key={`new-api-ip-${index}`}
                  >
                    <Field
                      name={`allowedIps.${index}`}
                      id={`allowedIps.${index}`}
                      component={InputField}
                      type="text"
                      placeholder="127.0.0.1"
                      maxLength={64}
                      spellCheck={false}
                    />

                    <Button
                      className="!border-red-600 !bg-red-700 hover:!bg-red-800 !p-2"
                      disabled={index === 0}
                      onClick={() =>
                        setFieldValue(
                          "allowedIps",
                          values.allowedIps.filter((_, i) => i !== index),
                        )
                      }
                    >
                      <FiTrash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <div>
                  <Button
                    variant="secondary"
                    className="mt-2"
                    onClick={() =>
                      setFieldValue("allowedIps", [...values.allowedIps, ""])
                    }
                    disabled={values.allowedIps.length >= 10}
                  >
                    Add another IP
                  </Button>
                </div>
              </div>
            </div>

            <Modal.ActionRow>
              <Button className="mt-6" disabled={isUpdatingKey || !isValid}>
                <FiSave />
                <span>Save</span>
              </Button>
            </Modal.ActionRow>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
