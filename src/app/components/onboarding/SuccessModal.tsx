import { CircleCheck } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function SuccessModal({
  open,
  onClose,
  title = "Success!",
  description = "Your action was completed successfully.",
}: SuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CircleCheck className="w-10 h-10 text-green-600" />
          </div>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">{description}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-4">
          <Button
            onClick={onClose}
            style={{ backgroundColor: '#220E92', borderRadius: '10px' }}
            className="px-8"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}