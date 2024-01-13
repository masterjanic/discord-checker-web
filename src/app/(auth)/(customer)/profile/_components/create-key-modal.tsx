"use client";

import clsx from "clsx";
import { Field, Form, Formik } from "formik";
import { FiPlus, FiTrash } from "react-icons/fi";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

import Button from "~/app/_components/common/button";
import InputField, { inputStyles } from "~/app/_components/common/input-field";
import Modal, { type TModalProps } from "~/app/_components/common/modal";
import { api } from "~/trpc/react";

export default function CreateKeyModal(props: TModalProps) {
  const utils = api.useUtils();
  const { mutateAsync: createKey, isLoading: isCreatingKey } =
    api.user.developer.createKey.useMutation({
      onSettled: async () => {
        await utils.user.developer.getKeys.invalidate();
        props.onClose(false);
      },
    });

  return (
    <Modal {...props}>
      <Modal.Head title="New API Key">
        Create a new API Key for external applications or your own projects.
      </Modal.Head>

      <Formik
        initialValues={{
          name: "",
          allowedIps: [""],
          expiresAt: new Date(),
        }}
        validationSchema={toFormikValidationSchema(
          z.object({
            name: z.string().min(1).max(32),
            allowedIps: z.array(z.string().ip()).min(1).max(10),
            expiresAt: z.date().refine((date) => date.getTime() > Date.now()),
          }),
        )}
        onSubmit={(values) => createKey(values)}
      >
        {({ errors, values, setFieldValue, isValid }) => (
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

              <div className="space-y-2">
                <label htmlFor="expiresAt" className="text-sm text-neutral-100">
                  Expiration Date:
                </label>
                <select
                  id="expiresAt"
                  name="expiresAt"
                  onChange={({ target }) => {
                    const days = parseInt(target.value);
                    if (days === -1) {
                      return setFieldValue("expiresAt", null);
                    }

                    const date = new Date();
                    date.setDate(date.getDate() + days);

                    return setFieldValue("expiresAt", date);
                  }}
                  className={clsx(
                    inputStyles.input,
                    "expiresAt" in errors && inputStyles.error,
                  )}
                >
                  <option disabled selected>
                    Select expiration
                  </option>
                  {[3, 7, 30, 90, 365].map((days) => (
                    <option>{days === -1 ? "Never" : `${days} days`}</option>
                  ))}
                </select>
              </div>
            </div>

            <Modal.ActionRow>
              <Button className="mt-6" disabled={isCreatingKey || !isValid}>
                <FiPlus />
                <span>Create API Key</span>
              </Button>
            </Modal.ActionRow>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
