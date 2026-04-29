import { useState } from "react";
import {
  approveStore,
  reactivateVendorStore,
  rejectStore,
  suspendVendorStore,
} from "@/app/Service/VendorListActionService/vendorListActionService";

type StatusUpdater = (id: string, newStatus: string) => void;

export function useStoreActions(onStatusChange: StatusUpdater) {
  const [showApproveModal, setShowApproveModal] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [showSuspendModal, setShowSuspendModal] = useState<string | null>(null);
  const [showReactivateModal, setShowReactivateModal] = useState<string | null>(null);

  const [approveError, setApproveError] = useState("");
  const [rejectError, setRejectError] = useState("");
  const [suspendError, setSuspendError] = useState("");
  const [reactivateError, setReactivateError] = useState("");

  const [suspendLoading, setSuspendLoading] = useState(false);
  const [reactivateLoading, setReactivateLoading] = useState(false);

  const handleApprove = async (id: string) => {
    try {
      setApproveError("");
      const response = await approveStore(id);
      if (response?.status === 200) {
        setShowApproveModal(null);
        onStatusChange(id, "APPROVED");
      } else {
        throw new Error(
          response?.data?.message + response?.status || "Failed to approve store"
        );
      }
    } catch (e) {
      console.error("Error approving store:", e);
      setApproveError(e instanceof Error ? e.message.slice(0, 40) : "Unknown error");
    }
  };

  const handleReject = async (id: string, reason: string) => {
    try {
      setRejectError("");
      const response = await rejectStore(id, reason);
      if (response?.status === 200) {
        setShowRejectModal(null);
        onStatusChange(id, "REJECTED");
      } else {
        throw new Error(
          response?.data?.message + response?.status || "Failed to reject store"
        );
      }
    } catch (e) {
      console.error("Error rejecting store:", e);
      setRejectError(e instanceof Error ? e.message.slice(0, 40) : "Unknown error");
    }
  };

  const handleSuspend = async (id: string) => {
    try {
      setSuspendError("");
      setSuspendLoading(true);
      const response = await suspendVendorStore(id);
      if (response?.status === 200) {
        setShowSuspendModal(null);
        onStatusChange(id, "SUSPENDED");
      } else {
        throw new Error("Failed to suspend store");
      }
    } catch (e) {
      console.error("Error suspending store:", e);
      setSuspendError(e instanceof Error ? e.message : "Failed to suspend store");
    } finally {
      setSuspendLoading(false);
    }
  };

  const handleReactivate = async (id: string) => {
    try {
      setReactivateError("");
      setReactivateLoading(true);
      await reactivateVendorStore(id);
      setShowReactivateModal(null);
      onStatusChange(id, "APPROVED");
    } catch (e) {
      console.error("Error reactivating store:", e);
      setReactivateError(e instanceof Error ? e.message : "Failed to reactivate store");
    } finally {
      setReactivateLoading(false);
    }
  };

  return {
    showApproveModal, setShowApproveModal,
    showRejectModal, setShowRejectModal,
    showSuspendModal, setShowSuspendModal,
    showReactivateModal, setShowReactivateModal,

    approveError, setApproveError,
    rejectError, setRejectError,
    suspendError, setSuspendError,
    reactivateError, setReactivateError,

    suspendLoading,
    reactivateLoading,

    handleApprove,
    handleReject,
    handleSuspend,
    handleReactivate,
  };
}
