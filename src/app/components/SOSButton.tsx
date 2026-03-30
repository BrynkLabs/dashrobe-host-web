import { useState } from "react";
import { AlertOctagon, X } from "lucide-react";

export function SOSButton() {
  const [showModal, setShowModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSOS = () => {
    setSending(true);
    // Simulate sending alert
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setTimeout(() => {
        setShowModal(false);
        setSent(false);
      }, 2000);
    }, 1500);
  };

  return (
    <>
      {/* Floating SOS Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-full shadow-2xl hover:shadow-red-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center z-50 group"
        title="Emergency SOS"
      >
        <AlertOctagon className="w-8 h-8 group-hover:animate-pulse" />
      </button>

      {/* SOS Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-in zoom-in duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertOctagon className="w-8 h-8" />
                  <h3 className="text-2xl font-bold">Emergency SOS</h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {!sent ? (
                <>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-red-900 mb-2">
                      Alert Support Team
                    </h4>
                    <p className="text-sm text-red-700">
                      This will immediately notify the Dashrobe operations team about
                      an emergency situation. Use only for:
                    </p>
                    <ul className="text-sm text-red-700 mt-2 space-y-1 list-disc list-inside">
                      <li>Safety concerns</li>
                      <li>Critical system failures</li>
                      <li>Urgent operational issues</li>
                      <li>Security incidents</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Issue Type
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                        <option>Safety Emergency</option>
                        <option>System Critical Failure</option>
                        <option>Security Incident</option>
                        <option>Operational Crisis</option>
                        <option>Other Emergency</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Brief Description (Optional)
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                        placeholder="Describe the emergency..."
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      disabled={sending}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSOS}
                      disabled={sending}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition-all font-bold disabled:opacity-50"
                    >
                      {sending ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                          Sending...
                        </span>
                      ) : (
                        "Send SOS Alert"
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Alert Sent Successfully
                  </h4>
                  <p className="text-gray-600">
                    Support team has been notified and will contact you shortly.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
