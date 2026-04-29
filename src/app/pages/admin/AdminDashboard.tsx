import { useNavigate } from "react-router";
import { useState, useId, useEffect } from "react";
import {
  Store,
  ArrowUpRight,
  Clock,
  Eye,
  CircleCheck,
  CircleX,
} from "lucide-react";
import {
  ConfirmModal,
  RejectModal,
} from "../../components/admin/StoreActionModals";
import { Pagination, usePagination } from "../../components/Pagination";
import { formatSubmittedAt } from "./AdminStores";
import {
  approveStore,
  getAll,
  rejectStore,
} from "@/app/Service/VendorListActionService/vendorListActionService";
import { StoreType } from "@/app/Service/VendorListActionService/Types/storeType";
import approvalIcon from "@/assets/approved-icon.png";

export function AdminDashboard() {
  const navigate = useNavigate();

  const [stores, setStores] = useState<StoreType[]>([]);
  const [showApproveModal, setShowApproveModal] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());
  const [rejectedIds, setRejectedIds] = useState<Set<string>>(new Set());
  const [pendingPage, setPendingPage] = useState(1);
  const [approveError, setApproveError] = useState<string>("");
  const [rejectError, setRejectError] = useState("");
  const ROWS_PER_PAGE = 5;

  const {
    paginated: paginatedStores,
    totalPages: totalPendingPages,
    safePage: safePendingPage,
  } = usePagination(stores, ROWS_PER_PAGE, pendingPage);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await getAll({ status: "SUBMITTED" });
        setStores(response.data.stores);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStores();
  }, [approvedIds, rejectedIds]);

  const handleApprove = async (id: string) => {
    try {
      setApproveError("");
      const response = await approveStore(id);
      if (response?.status === 200) {
        setApprovedIds((prev) => new Set(prev).add(id));
        setShowApproveModal(null);
      } else {
        throw new Error(
          response?.data?.message + response?.status ||
            "Failed to approve store"
        );
      }
    } catch (e) {
      console.error("Error approving store:", e);
      setApproveError(
        e instanceof Error ? e.message.slice(0, 40) : "Unknown error"
      );
      return;
    }
  };

  const handleReject = async (id: string, reason: string) => {
    try {
      setRejectError("");

      const response = await rejectStore(id, reason);

      if (response?.status === 200) {
        setRejectedIds((prev) => new Set(prev).add(id));
        setShowRejectModal(null);
      } else {
        throw new Error(
          response?.data?.message + response?.status || "Failed to reject store"
        );
      }
    } catch (e) {
      console.error("Error rejecting store:", e);
      setRejectError(
        e instanceof Error ? e.message.slice(0, 40) : "Unknown error"
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700 }}>Admin Dashboard</h1>
          <p
            className="text-muted-foreground mt-0.5"
            style={{ fontSize: "13px" }}
          >
            Marketplace overview and key metrics
          </p>
        </div>
        {stores.length > 0 && (
          <button
            onClick={() => navigate("/admin/stores")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-200 text-amber-800 px-4 py-2.5 rounded-xl hover:shadow-md transition-all"
            style={{ fontSize: "13px", fontWeight: 600 }}
          >
            <Clock className="w-4 h-4" />
            {stores.length} stores awaiting approval
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Pending Stores Section */}
      {stores.length > 0 ? (
        <div className="bg-card rounded-2xl border border-amber-200/80 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-gradient-to-r from-amber-50/80 to-orange-50/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: 600 }}>
                  Pending Store Applications
                </h3>
                <p
                  className="text-muted-foreground"
                  style={{ fontSize: "12px" }}
                >
                  {stores.length} vendors waiting for review
                </p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/25">
                  {[
                    "Store Name",
                    "Owner",
                    "Location",
                    "Applied",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-left text-muted-foreground whitespace-nowrap"
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedStores.map((s) => (
                  <tr
                    key={s.vendorId}
                    className="border-b border-border last:border-b-0 hover:bg-muted/15 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#220E92]/8 flex items-center justify-center shrink-0">
                          <Store className="w-3.5 h-3.5 text-[#220E92]" />
                        </div>
                        <span style={{ fontSize: "13px", fontWeight: 600 }}>
                          {s.storeName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ fontSize: "13px" }}>{s.ownerName}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-muted-foreground"
                        style={{ fontSize: "13px" }}
                      >
                        {s.location}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-muted-foreground"
                        style={{ fontSize: "12px" }}
                      >
                        {formatSubmittedAt(s.submittedAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setShowApproveModal(s.vendorId)}
                          disabled={s.status !== "SUBMITTED"}
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border transition-colors ${
                            s.status === "SUBMITTED"
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-300"
                              : "bg-muted/50 text-muted-foreground/50 border-border cursor-not-allowed"
                          }`}
                          style={{ fontSize: "12px", fontWeight: 600 }}
                          title={
                            s.status ? "APPROVED" : "Onboarding incomplete"
                          }
                        >
                          <CircleCheck className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => setShowRejectModal(s.vendorId)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors"
                          style={{ fontSize: "12px", fontWeight: 600 }}
                          title="Reject"
                        >
                          <CircleX className="w-3.5 h-3.5" />
                          Reject
                        </button>
                        <button
                          onClick={() =>navigate(`/admin/stores/${s.vendorId}`)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#220E92]/8 text-[#220E92] hover:bg-[#220E92]/15 border border-[#220E92]/20 transition-colors"
                          style={{ fontSize: "12px", fontWeight: 600 }}
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={safePendingPage}
            totalPages={totalPendingPages}
            totalItems={stores.length}
            itemsPerPage={ROWS_PER_PAGE}
            onPageChange={setPendingPage}
            itemLabel="stores"
          />
          <div className="px-5 py-2 flex items-center justify-end border-t border-border">
            <button
              onClick={() => navigate("/admin/stores")}
              className="text-[#220E92] hover:underline flex items-center gap-1"
              style={{ fontSize: "13px", fontWeight: 600 }}
            >
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border shadow-sm p-8 text-center w-full md:w-[50%] ml-auto mr-auto mt-[15%] flex flex-col items-center gap-2">
          <img src={approvalIcon} alt="approved" className="w-[100px] h-[100px]" />
          <p style={{ fontSize: "24px", fontWeight: 700 }} className="mb-2 w-[90%]">🎉 All Stores Successfully Approved</p>
          <p className="text-muted-foreground w-[90%]" style={{ fontSize: "14px" }}>
            Every store on the platform has been reviewed and approved. Sellers can now list products and accept orders.
          </p>
        </div>
      )}

      {/* Approve Modal */}
      <ConfirmModal
        open={!!showApproveModal}
        icon={CircleCheck}
        tone="emerald"
        title="Approve Store"
        subtitle="This will activate the vendor's store"
        message={
          <>
            Are you sure you want to approve{" "}
            <strong>
              {stores.find((s) => s.vendorId === showApproveModal)?.storeName}
            </strong>
            ? The vendor will be able to list products and receive orders.
          </>
        }
        confirmLabel="Approve"
        error={approveError}
        onConfirm={() => showApproveModal && handleApprove(showApproveModal)}
        onClose={() => { setShowApproveModal(null); setApproveError(""); }}
      />

      {/* Reject Modal */}
      <RejectModal
        open={!!showRejectModal}
        icon={CircleX}
        storeName={stores.find((s) => s.vendorId === showRejectModal)?.storeName || "store"}
        error={rejectError}
        onReject={(reason) => showRejectModal && handleReject(showRejectModal, reason)}
        onClose={() => { setShowRejectModal(null); setRejectError(""); }}
      />
    </div>
  );
}
