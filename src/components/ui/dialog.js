import * as React from "react";
import * as RadixDialog from "@radix-ui/react-dialog";

export const Dialog = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;
export const DialogPortal = RadixDialog.Portal;
export const DialogOverlay = React.forwardRef(
  ({ className, ...props }, ref) => (
    <RadixDialog.Overlay
      ref={ref}
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm ${className}`}
      {...props}
    />
  )
);
DialogOverlay.displayName = "DialogOverlay";

export const DialogContent = React.forwardRef(
  ({ className, ...props }, ref) => (
    <RadixDialog.Portal>
      <DialogOverlay />
      <RadixDialog.Content
        ref={ref}
        className={`fixed left-[50%] top-[50%] max-h-[90vh] w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white p-6 shadow-lg ${className}`}
        {...props}
      />
    </RadixDialog.Portal>
  )
);
DialogContent.displayName = "DialogContent";

export const DialogHeader = ({ className, ...props }) => (
  <div className={`mb-4 ${className}`} {...props} />
);
DialogHeader.displayName = "DialogHeader";

export const DialogTitle = RadixDialog.Title;
export const DialogDescription = RadixDialog.Description;
