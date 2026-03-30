import { useState } from "react";
import {
  Bell,
  Package,
  Clock,
  TriangleAlert,
  CircleCheck,
  X,
  ExternalLink,
} from "lucide-react";

interface Notification {
  id: string;
  type: "new_order" | "delayed" | "low_stock" | "success";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "new_order",
    title: "New Order Received",
    message: "Order #12847 - ₹2,499 • 2 items",
    time: "2 mins ago",
    read: false,
  },
  {
    id: "2",
    type: "delayed",
    title: "Order Running Late",
    message: "Order #12841 is delayed by 15 minutes",
    time: "10 mins ago",
    read: false,
  },
  {
    id: "3",
    type: "low_stock",
    title: "Low Inventory Alert",
    message: "Blue Denim Shirt (M) - Only 3 left",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "4",
    type: "success",
    title: "Order Delivered",
    message: "Order #12835 delivered successfully",
    time: "2 hours ago",
    read: true,
  },
];

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "new_order":
        return <Package className="w-5 h-5 text-yellow-600" />;
      case "delayed":
        return <Clock className="w-5 h-5 text-red-600" />;
      case "low_stock":
        return <TriangleAlert className="w-5 h-5 text-orange-600" />;
      case "success":
        return <CircleCheck className="w-5 h-5 text-green-600" />;
    }
  };

  const getBackgroundColor = (type: Notification["type"]) => {
    switch (type) {
      case "new_order":
        return "bg-yellow-50 border-yellow-200";
      case "delayed":
        return "bg-red-50 border-red-200";
      case "low_stock":
        return "bg-orange-50 border-orange-200";
      case "success":
        return "bg-green-50 border-green-200";
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <>
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#FFC100] rounded-full animate-pulse"></span>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FFC100] text-[#220E92] rounded-full text-xs font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          </>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Dropdown Panel */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900">Notifications</h3>
                <p className="text-xs text-gray-600 mt-1">
                  {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-[#220E92] hover:underline font-medium"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.read ? "bg-blue-50/30" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${getBackgroundColor(
                        notification.type
                      )} border flex items-center justify-center flex-shrink-0`}
                    >
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          className={`text-sm font-semibold text-gray-900 ${
                            !notification.read ? "font-bold" : ""
                          }`}
                        >
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-[#220E92] rounded-full mt-1.5 flex-shrink-0"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {notification.time}
                        </span>
                        <ExternalLink className="w-3 h-3 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-3 bg-gray-50 border-t border-gray-200">
              <button className="w-full py-2 text-sm font-medium text-[#220E92] hover:bg-white rounded-lg transition-colors">
                View All Notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}