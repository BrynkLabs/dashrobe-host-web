import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import requestSentIcon from "@/assets/icons/sent-request.png";

export function RequestCategoryDialog({
  open,
  success,
  onClose,
}: {
  open: boolean;
  success: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-[#1A1A2E]">Request Category</DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center text-center py-6">
            <img src={requestSentIcon} alt="Success" className="w-30 h-30 mb-4" />
            <p className="text-2xl font-bold text-[#16A34A] mb-2">Request Sent Successfully!!</p>
            <p className="text-sm text-[#71717A]">
              Our team will reach out to you shortly on {localStorage.getItem("phoneNumber") || "your verified number"}.
              <br />
              Please continue by selecting other categories
            </p>
            <Button
              onClick={onClose}
              style={{ backgroundColor: "#220E92", borderRadius: "12px" }}
              className="w-full py-5 text-base font-semibold mt-6"
            >
              Continue
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center py-6">
            <Loader2 className="w-10 h-10 animate-spin text-[#220E92] mb-4" />
            <p className="text-sm text-gray-500">Sending request...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
