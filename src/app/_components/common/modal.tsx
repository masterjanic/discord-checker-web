import { Dialog } from "@headlessui/react";
import clsx from "clsx";
import { type PropsWithChildren } from "react";
import { FiX } from "react-icons/fi";
import Box from "~/app/_components/common/box";

export interface IModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
}

interface ModalSubComponents {
  Head: typeof Head;
  ActionRow: typeof ActionRow;
}

const Modal: React.FC<PropsWithChildren<IModalProps>> & ModalSubComponents = ({
  isOpen,
  onClose,
  children,
  className,
  ...props
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50 font-sans"
      {...props}
    >
      <div
        className="fixed inset-0 bg-blueish-grey-900/90"
        aria-hidden="true"
      />

      <div className="slim-scrollbar fixed inset-2 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel
            as={Box}
            className={clsx(
              "relative w-full max-w-lg bg-opacity-50 backdrop-blur",
              className,
            )}
          >
            <button
              onClick={onClose}
              className="absolute right-[-1px] top-[-1px] flex h-[2.1rem] w-[2.1rem] items-center justify-center rounded-bl-xl rounded-tr-xl border border-blueish-grey-600/80 bg-blueish-grey-600 bg-opacity-[20%] p-2 text-neutral-200 transition-colors duration-150 hover:bg-opacity-[60%] hover:text-neutral-100"
            >
              <span className="sr-only">Close</span>
              <FiX className="h-4 w-4" />
            </button>

            {children}
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

interface IModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
}

const Head: React.FC<IModalHeaderProps> = ({
  title,
  className,
  children,
  ...props
}) => {
  return (
    <div className={clsx("mb-6 space-y-3", className)} {...props}>
      <Dialog.Title as="h2" className="text-xl font-semibold">
        {title}
      </Dialog.Title>
      <Dialog.Description as="p" className="text-sm text-neutral-200">
        {children}
      </Dialog.Description>
    </div>
  );
};
Modal.Head = Head;

type TActionRowProps = PropsWithChildren & React.HTMLAttributes<HTMLDivElement>;

const ActionRow: React.FC<TActionRowProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx("mt-6 border-t border-neutral-100/10", className)}
      {...props}
    >
      {children}
    </div>
  );
};
Modal.ActionRow = ActionRow;

export default Modal;
