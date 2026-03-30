import { useState } from "react";
import { useSearchParams } from "react-router";
import {
  Search, ChevronRight, CircleCheck, Truck, Package, CircleX, Clock,
  RefreshCw, X, ArrowLeft, Check, Ban, ChevronDown, Hand, Download,
  MapPin, Phone, Mail, Copy, ExternalLink, Pencil,
  SquareCheck, CreditCard, Store, ShieldCheck, Link2, Send,
} from "lucide-react";
import { Pagination, usePagination } from "../../components/Pagination";

/* ─── Product images ─── */
const productImages = [
  "https://images.unsplash.com/photo-1766848482243-4379ac576b1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZXJhbWljJTIwY29mZmVlJTIwbXVnJTIwcHJvZHVjdHxlbnwxfHx8fDE3NzMwMzgwOTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1761210719325-283557e92487?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMHBvdHRlcnklMjBib3dsfGVufDF8fHx8MTc3MzAzODA5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1646006409124-81deb1275459?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWNvcmF0aXZlJTIwY2FuZGxlJTIwcHJvZHVjdHxlbnwxfHx8fDE3NzMwMzgwOTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1617695615794-a5abcece0f48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc2FuJTIwd29vZGVuJTIwdHJheXxlbnwxfHx8fDE3NzMwMzgwOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1601241773118-9e67091e199e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3R0b24lMjB3b3ZlbiUyMGN1c2hpb24lMjBjb3ZlcnxlbnwxfHx8fDE3NzMwMzgwOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
];

/* ─── Types ─── */
interface LineItem {
  name: string;
  sku: string;
  price: number;
  qty: number;
  image: string;
}

interface FulfillmentInfo {
  id: string;
  status: "in_transit" | "delivered" | "pending" | "out_for_delivery";
  carrier: string;
  trackingNumber: string;
  shippedDate: string;
  weight: string;
}

interface Address {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

interface PaymentSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  paid: number;
  method: string;
}

interface TimelineEvent {
  date: string;
  events: { time: string; description: string }[];
}

interface OrderTimeline {
  step: string;
  time: string;
  done: boolean;
  active?: boolean;
}

interface Order {
  id: string;
  customer: string;
  email: string;
  amount: string;
  commission: string;
  status: string;
  payment: string;
  date: string;
  items: number;
  manualDelivery: boolean;
  timeline: OrderTimeline[];
  lineItems: LineItem[];
  fulfillment?: FulfillmentInfo;
  paymentSummary: PaymentSummary;
  shippingAddress: Address;
  billingAddress?: Address;
  billingSameAsShipping: boolean;
  channel: string;
  orderCount: number;
  phone: string;
  placedAt: string;
  tags: string[];
  notes?: string;
  detailedTimeline: TimelineEvent[];
}

/*
  ═══════════════════════════════════════════════════════════
  ORDER FLOW:
  Place Order → Vendor Approves → Payment Link Sent
  → Payment Complete → Order Confirmed
  → Packed → Dispatched → Delivered
  ═══════════════════════════════════════════════════════════
*/

/* ─── Status config ─── */
const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending_approval:   { label: "Pending Approval",  color: "text-blue-700",    bg: "bg-blue-50" },
  approved:           { label: "Approved",           color: "text-indigo-700",  bg: "bg-indigo-50" },
  payment_link_sent:  { label: "Payment Link Sent",  color: "text-amber-700",   bg: "bg-amber-50" },
  payment_complete:   { label: "Payment Complete",    color: "text-teal-700",    bg: "bg-teal-50" },
  confirmed:          { label: "Order Confirmed",     color: "text-emerald-700", bg: "bg-emerald-50" },
  packed:             { label: "Packed",              color: "text-orange-700",  bg: "bg-orange-50" },
  dispatched:         { label: "Dispatched",          color: "text-purple-700",  bg: "bg-purple-50" },
  delivered:          { label: "Delivered",            color: "text-emerald-700", bg: "bg-emerald-50" },
  refund_requested:   { label: "Refund Request",      color: "text-red-600",     bg: "bg-red-50" },
  rejected:           { label: "Rejected",             color: "text-red-600",     bg: "bg-red-50" },
  manual_delivery:    { label: "Manual Delivery",      color: "text-orange-700",  bg: "bg-orange-50" },
};

const fulfillmentStatusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending:          { label: "Pending",           color: "text-amber-700",   bg: "bg-amber-50" },
  in_transit:       { label: "In transit",        color: "text-blue-700",    bg: "bg-blue-50" },
  out_for_delivery: { label: "Out for delivery",  color: "text-purple-700",  bg: "bg-purple-50" },
  delivered:        { label: "Delivered",          color: "text-emerald-700", bg: "bg-emerald-50" },
};

const manualStatuses = [
  { id: "packed", label: "Packed" },
  { id: "dispatched", label: "Dispatched" },
  { id: "out_for_delivery", label: "Out for Delivery" },
  { id: "delivered", label: "Delivered" },
];

/* The full step order for the progress timeline */
const fullSteps = [
  "Order Placed",
  "Vendor Approved",
  "Payment Link Sent",
  "Payment Complete",
  "Order Confirmed",
  "Packed",
  "Dispatched",
  "Delivered",
];

function getNow() {
  const d = new Date();
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  const hh = h % 12 || 12;
  return `${months[d.getMonth()]} ${d.getDate()}, ${hh}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function formatCurrency(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {});
}

/* Helper: build the 8-step timeline up to a given completed-step index */
function buildTimeline(completedUpTo: number, times: string[]): OrderTimeline[] {
  return fullSteps.map((step, i) => ({
    step,
    time: i <= completedUpTo ? (times[i] || "") : "",
    done: i <= completedUpTo,
    active: i === completedUpTo + 1,
  }));
}

/* ─── Mock Data ─── */
const initialOrders: Order[] = [
  /* 1 — Pending Approval — just placed 2 min ago */
  {
    id: "ORD-8012", customer: "Priya Sharma", email: "priya@dashrobe.in",
    amount: "₹4,250", commission: "₹425", status: "pending_approval",
    payment: "—", date: "Feb 20, 2026", items: 3, manualDelivery: false,
    phone: "+91 98765 43210", orderCount: 5, channel: "Dashrobe",
    placedAt: "February 20, 2026 at 11:42 AM", tags: ["Priority", "Returning Customer"],
    lineItems: [
      { name: "Calm Blue Mug", sku: "MUG-B2-05", price: 1250, qty: 1, image: productImages[0] },
      { name: "Ash Line Mug", sku: "MUG-B2-14", price: 1500, qty: 1, image: productImages[1] },
      { name: "Lavender Candle Set", sku: "CND-LV-03", price: 1500, qty: 1, image: productImages[2] },
    ],
    paymentSummary: { subtotal: 4250, shipping: 0, tax: 0, discount: 0, total: 4250, paid: 0, method: "Pending" },
    shippingAddress: { name: "Priya Sharma", line1: "302, Lotus Apartments", line2: "MG Road, Koramangala", city: "Bangalore", state: "KA", zip: "560034", country: "India", phone: "+91 98765 43210" },
    billingSameAsShipping: true,
    timeline: buildTimeline(0, ["Feb 20, 11:42 AM"]),
    detailedTimeline: [
      { date: "February 20", events: [
        { time: "11:42 AM", description: "Order ORD-8012 was placed via Dashrobe storefront" },
        { time: "11:42 AM", description: "Order confirmation sent to Priya Sharma" },
        { time: "11:42 AM", description: "Awaiting vendor approval" },
      ]},
    ],
  },
  /* 2 — Payment Link Sent — approved in 3 min, link sent immediately */
  {
    id: "ORD-8011", customer: "Rahul Mehta", email: "rahul@email.com",
    amount: "₹2,180", commission: "₹218", status: "payment_link_sent",
    payment: "—", date: "Feb 20, 2026", items: 1, manualDelivery: false,
    phone: "+91 87654 32109", orderCount: 2, channel: "Dashrobe",
    placedAt: "February 20, 2026 at 11:00 AM", tags: [],
    lineItems: [
      { name: "Wooden Serving Tray", sku: "TRY-WD-08", price: 2180, qty: 1, image: productImages[3] },
    ],
    paymentSummary: { subtotal: 2180, shipping: 0, tax: 0, discount: 0, total: 2180, paid: 0, method: "Pending" },
    shippingAddress: { name: "Rahul Mehta", line1: "45, Sector 18", city: "Noida", state: "UP", zip: "201301", country: "India", phone: "+91 87654 32109" },
    billingSameAsShipping: true,
    timeline: buildTimeline(2, ["Feb 20, 11:00 AM", "Feb 20, 11:03 AM", "Feb 20, 11:04 AM"]),
    detailedTimeline: [
      { date: "February 20", events: [
        { time: "11:00 AM", description: "Order ORD-8011 was placed via Dashrobe storefront" },
        { time: "11:03 AM", description: "Order approved by vendor" },
        { time: "11:04 AM", description: "Payment link sent to Rahul Mehta (rahul@email.com)" },
        { time: "—", description: "Waiting for customer to complete payment" },
      ]},
    ],
  },
  /* 3 — Packed — full flow in 22 min, awaiting rider pickup */
  {
    id: "ORD-8010", customer: "Anita Singh", email: "anita@haikudesignhouse.in",
    amount: "₹6,320", commission: "₹632", status: "packed",
    payment: "Card", date: "Feb 20, 2026", items: 2, manualDelivery: false,
    phone: "+91 99208 73841", orderCount: 8, channel: "Dashrobe",
    placedAt: "February 20, 2026 at 10:00 AM", tags: ["VIP", "Returning Customer"],
    notes: "Please pack items carefully with extra bubble wrap.",
    lineItems: [
      { name: "Calm Blue Mug", sku: "MUG-B2-05", price: 1250, qty: 2, image: productImages[0] },
      { name: "Woven Cushion Cover", sku: "CSN-WV-11", price: 1910, qty: 2, image: productImages[4] },
    ],
    fulfillment: {
      id: "ORD-8010-F1", status: "pending", carrier: "Dashrobe Express",
      trackingNumber: "DR90261038", shippedDate: "Feb 20, 2026", weight: "1.2 kg",
    },
    paymentSummary: { subtotal: 6320, shipping: 0, tax: 0, discount: 0, total: 6320, paid: 6320, method: "Visa ending 4242" },
    shippingAddress: { name: "Anita Singh", line1: "1101, 11th Floor, Earth Building", line2: "N S Rd no 5, JVPD Scheme", city: "Mumbai", state: "MH", zip: "400056", country: "India", phone: "+91 99208 73841" },
    billingSameAsShipping: false,
    billingAddress: { name: "Anita Singh", line1: "B-204, Raheja Heights", city: "Mumbai", state: "MH", zip: "400058", country: "India", phone: "+91 99208 73841" },
    timeline: buildTimeline(5, [
      "Feb 20, 10:00 AM", "Feb 20, 10:03 AM", "Feb 20, 10:04 AM",
      "Feb 20, 10:08 AM", "Feb 20, 10:08 AM", "Feb 20, 10:22 AM",
    ]),
    detailedTimeline: [
      { date: "February 20", events: [
        { time: "10:00 AM", description: "Order ORD-8010 was placed via Dashrobe storefront" },
        { time: "10:03 AM", description: "Order approved by vendor" },
        { time: "10:04 AM", description: "Payment link sent to Anita Singh (anita@haikudesignhouse.in)" },
        { time: "10:08 AM", description: "Payment of ₹6,320 received (Visa ending 4242)" },
        { time: "10:08 AM", description: "Order confirmed — ready for fulfillment" },
        { time: "10:22 AM", description: "Items packed — Fulfillment ORD-8010-F1 created" },
        { time: "10:22 AM", description: "Rider assigned via Dashrobe Express — awaiting pickup" },
      ]},
    ],
  },
  /* 4 — Delivered — full cycle in ~72 min */
  {
    id: "ORD-8009", customer: "Vikram Patel", email: "vikram@email.com",
    amount: "₹1,890", commission: "₹189", status: "delivered",
    payment: "UPI", date: "Feb 20, 2026", items: 1, manualDelivery: false,
    phone: "+91 77890 12345", orderCount: 1, channel: "Dashrobe",
    placedAt: "February 20, 2026 at 9:00 AM", tags: ["First Order"],
    lineItems: [
      { name: "Artisan Candle Trio", sku: "CND-AT-07", price: 1890, qty: 1, image: productImages[2] },
    ],
    fulfillment: {
      id: "ORD-8009-F1", status: "delivered", carrier: "Dashrobe Express",
      trackingNumber: "DR90261029", shippedDate: "Feb 20, 2026", weight: "0.5 kg",
    },
    paymentSummary: { subtotal: 1890, shipping: 0, tax: 0, discount: 0, total: 1890, paid: 1890, method: "UPI" },
    shippingAddress: { name: "Vikram Patel", line1: "12, Shaligram Residency", line2: "SG Highway", city: "Ahmedabad", state: "GJ", zip: "380054", country: "India", phone: "+91 77890 12345" },
    billingSameAsShipping: true,
    timeline: buildTimeline(7, [
      "Feb 20, 9:00 AM", "Feb 20, 9:02 AM", "Feb 20, 9:03 AM",
      "Feb 20, 9:06 AM", "Feb 20, 9:06 AM", "Feb 20, 9:18 AM",
      "Feb 20, 9:22 AM", "Feb 20, 9:48 AM",
    ]),
    detailedTimeline: [
      { date: "February 20", events: [
        { time: "9:00 AM", description: "Order ORD-8009 was placed via Dashrobe storefront" },
        { time: "9:02 AM", description: "Order approved by vendor" },
        { time: "9:03 AM", description: "Payment link sent to Vikram Patel (vikram@email.com)" },
        { time: "9:06 AM", description: "Payment of ₹1,890 received via UPI" },
        { time: "9:06 AM", description: "Order confirmed — ready for fulfillment" },
        { time: "9:18 AM", description: "Items packed — Fulfillment ORD-8009-F1 created" },
        { time: "9:22 AM", description: "Rider picked up — dispatched via Dashrobe Express (tracking: DR90261029)" },
        { time: "9:23 AM", description: "Live tracking link sent to Vikram Patel" },
        { time: "9:48 AM", description: "Delivered to Vikram Patel — 48 min from order" },
        { time: "9:48 AM", description: "Delivery confirmation sent" },
      ]},
    ],
  },
  /* 5 — Refund Requested — delivered in 75 min, refund next morning */
  {
    id: "ORD-8008", customer: "Neha Gupta", email: "neha@email.com",
    amount: "₹3,450", commission: "₹345", status: "refund_requested",
    payment: "Wallet", date: "Feb 20, 2026", items: 2, manualDelivery: false,
    phone: "+91 88234 56789", orderCount: 3, channel: "Dashrobe",
    placedAt: "February 20, 2026 at 2:00 PM", tags: ["Refund Pending"],
    lineItems: [
      { name: "Wooden Serving Tray", sku: "TRY-WD-08", price: 2180, qty: 1, image: productImages[3] },
      { name: "Calm Blue Mug", sku: "MUG-B2-05", price: 1270, qty: 1, image: productImages[0] },
    ],
    fulfillment: {
      id: "ORD-8008-F1", status: "delivered", carrier: "Dashrobe Express",
      trackingNumber: "DR90261015", shippedDate: "Feb 20, 2026", weight: "1.1 kg",
    },
    paymentSummary: { subtotal: 3450, shipping: 0, tax: 0, discount: 0, total: 3450, paid: 3450, method: "Dashrobe Wallet" },
    shippingAddress: { name: "Neha Gupta", line1: "F-42, Green Park Extension", city: "New Delhi", state: "DL", zip: "110016", country: "India", phone: "+91 88234 56789" },
    billingSameAsShipping: true,
    timeline: [
      ...buildTimeline(7, [
        "Feb 20, 2:00 PM", "Feb 20, 2:02 PM", "Feb 20, 2:03 PM",
        "Feb 20, 2:06 PM", "Feb 20, 2:06 PM", "Feb 20, 2:18 PM",
        "Feb 20, 2:22 PM", "Feb 20, 2:42 PM",
      ]),
      { step: "Refund Requested", time: "Feb 20, 3:30 PM", done: true, active: false },
    ],
    detailedTimeline: [
      { date: "February 20", events: [
        { time: "2:00 PM", description: "Order ORD-8008 was placed via Dashrobe storefront" },
        { time: "2:02 PM", description: "Order approved by vendor" },
        { time: "2:03 PM", description: "Payment link sent to Neha Gupta (neha@email.com)" },
        { time: "2:06 PM", description: "Payment of ₹3,450 deducted from Dashrobe Wallet" },
        { time: "2:06 PM", description: "Order confirmed — ready for fulfillment" },
        { time: "2:18 PM", description: "Items packed — Fulfillment ORD-8008-F1 created" },
        { time: "2:22 PM", description: "Rider picked up — dispatched via Dashrobe Express (tracking: DR90261015)" },
        { time: "2:23 PM", description: "Live tracking link sent to Neha Gupta" },
        { time: "2:42 PM", description: "Delivered to Neha Gupta — 42 min from order" },
      ]},
      { date: "February 20", events: [
        { time: "3:30 PM", description: "Customer requested refund — Reason: Product quality not as expected" },
        { time: "3:30 PM", description: "Refund request notification sent to vendor" },
      ]},
    ],
  },
];

/* ─── Helpers ─── */
function getNow2() { return getNow(); }

/* ─── Main Component ─── */
export function VendorOrders() {
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(searchParams.get("order"));
  const [filter, setFilter] = useState("all");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const selected = orders.find((o) => o.id === selectedId);

  const filtered = orders.filter((o) => {
    if (filter !== "all" && o.status !== filter) return false;
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) && !o.customer.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const [ordersPage, setOrdersPage] = useState(1);
  const ORDERS_PER_PAGE = 8;
  const { paginated: paginatedOrders, totalPages: ordersTotalPages, safePage: safeOrdersPage } = usePagination(filtered, ORDERS_PER_PAGE, ordersPage);

  const updateOrder = (id: string, updater: (o: Order) => Order) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? updater(o) : o)));
  };

  /* ── Flow actions ── */

  // Step 1: Vendor approves (pending_approval → approved)
  const handleApprove = (id: string) => {
    updateOrder(id, (o) => {
      const now = getNow2();
      return {
        ...o,
        status: "approved",
        timeline: o.timeline.map((t, i) =>
          i === 1 ? { ...t, time: now, done: true, active: false }
          : i === 2 ? { ...t, active: true }
          : { ...t, active: false }
        ),
        detailedTimeline: [
          ...o.detailedTimeline.slice(0, -1),
          {
            ...o.detailedTimeline[o.detailedTimeline.length - 1],
            events: [
              ...o.detailedTimeline[o.detailedTimeline.length - 1].events,
              { time: now.split(", ").pop() || now, description: "Order approved by vendor" },
            ],
          },
        ],
      };
    });
  };

  // Step 2: Send payment link (approved → payment_link_sent)
  const handleSendPaymentLink = (id: string) => {
    updateOrder(id, (o) => {
      const now = getNow2();
      return {
        ...o,
        status: "payment_link_sent",
        timeline: o.timeline.map((t, i) =>
          i === 2 ? { ...t, time: now, done: true, active: false }
          : i === 3 ? { ...t, active: true }
          : { ...t, active: i > 2 ? false : t.active }
        ),
        detailedTimeline: [
          ...o.detailedTimeline.slice(0, -1),
          {
            ...o.detailedTimeline[o.detailedTimeline.length - 1],
            events: [
              ...o.detailedTimeline[o.detailedTimeline.length - 1].events,
              { time: now.split(", ").pop() || now, description: `Payment link sent to ${o.customer} (${o.email})` },
            ],
          },
        ],
      };
    });
  };

  // Step 3: Mark payment complete (payment_link_sent → confirmed)
  const handlePaymentComplete = (id: string) => {
    updateOrder(id, (o) => {
      const now = getNow2();
      return {
        ...o,
        status: "confirmed",
        payment: o.paymentSummary.method !== "Pending" ? o.payment : "Online",
        paymentSummary: { ...o.paymentSummary, paid: o.paymentSummary.total, method: o.paymentSummary.method === "Pending" ? "Online Payment" : o.paymentSummary.method },
        timeline: o.timeline.map((t, i) =>
          i === 3 ? { ...t, time: now, done: true, active: false }
          : i === 4 ? { ...t, time: now, done: true, active: false }
          : i === 5 ? { ...t, active: true }
          : { ...t, active: i > 3 ? false : t.active }
        ),
        detailedTimeline: [
          ...o.detailedTimeline.slice(0, -1),
          {
            ...o.detailedTimeline[o.detailedTimeline.length - 1],
            events: [
              ...o.detailedTimeline[o.detailedTimeline.length - 1].events,
              { time: now.split(", ").pop() || now, description: `Payment of ${o.amount} received` },
              { time: now.split(", ").pop() || now, description: "Order confirmed — ready for fulfillment" },
            ],
          },
        ],
      };
    });
  };

  // Reject order
  const handleReject = (id: string) => {
    updateOrder(id, (o) => {
      const now = getNow2();
      return {
        ...o,
        status: "rejected",
        timeline: o.timeline.map((t, i) =>
          i === 1 ? { ...t, step: "Rejected", time: now, done: true, active: false } : { ...t, active: false }
        ),
        detailedTimeline: [
          ...o.detailedTimeline.slice(0, -1),
          {
            ...o.detailedTimeline[o.detailedTimeline.length - 1],
            events: [
              ...o.detailedTimeline[o.detailedTimeline.length - 1].events,
              { time: now.split(", ").pop() || now, description: "Order rejected by vendor" },
            ],
          },
        ],
      };
    });
  };

  // Fulfillment: confirmed → packed → dispatched
  const handleNextFulfillment = (id: string) => {
    updateOrder(id, (o) => {
      const flowMap: Record<string, { next: string; stepIdx: number }> = {
        confirmed: { next: "packed", stepIdx: 5 },
        packed: { next: "dispatched", stepIdx: 6 },
      };
      const flow = flowMap[o.status];
      if (!flow) return o;
      const now = getNow2();
      return {
        ...o,
        status: flow.next,
        timeline: o.timeline.map((t, i) =>
          i === flow.stepIdx ? { ...t, time: now, done: true, active: false }
          : i === flow.stepIdx + 1 ? { ...t, active: true }
          : { ...t, active: i > flow.stepIdx ? false : t.active }
        ),
        detailedTimeline: [
          ...o.detailedTimeline.slice(0, -1),
          {
            ...o.detailedTimeline[o.detailedTimeline.length - 1],
            events: [
              ...o.detailedTimeline[o.detailedTimeline.length - 1].events,
              { time: now.split(", ").pop() || now, description: `Order marked as ${flow.next}` },
            ],
          },
        ],
      };
    });
  };

  // Cancel dashboard delivery → manual mode
  const handleCancelDashboardDelivery = (id: string) => {
    updateOrder(id, (o) => ({
      ...o,
      manualDelivery: true,
      timeline: [
        ...o.timeline.filter((t) => t.done),
        { step: "Dashboard Delivery Cancelled", time: getNow2(), done: true },
        { step: "Manual Delivery — Vendor Managed", time: "", done: false, active: true },
      ],
    }));
  };

  const handleManualStatusChange = (id: string, newStatus: string) => {
    updateOrder(id, (o) => {
      const statusLabel = manualStatuses.find((s) => s.id === newStatus)?.label || newStatus;
      const isDelivered = newStatus === "delivered";
      return {
        ...o,
        status: isDelivered ? "delivered" : o.status,
        timeline: [
          ...o.timeline.filter((t) => t.done && t.step !== "Manual Delivery — Vendor Managed"),
          { step: statusLabel, time: getNow2(), done: true },
          ...(isDelivered
            ? []
            : [{ step: "Manual Delivery — Vendor Managed", time: "", done: false, active: true }]),
        ],
      };
    });
    setStatusDropdownOpen(false);
  };

  const handleDownloadCSV = () => {
    const headers = ["Order ID", "Customer", "Email", "Amount", "Commission", "Status", "Payment", "Date", "Items", "Manual Delivery"];
    const rows = orders.map((o) => [
      o.id, o.customer, o.email, o.amount.replace(/[₹,]/g, ""),
      o.commission.replace(/[₹,]/g, ""), (statusConfig[o.status]?.label || o.status),
      o.payment, o.date, String(o.items), o.manualDelivery ? "Yes" : "No",
    ]);
    const csvContent = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = (text: string, field: string) => {
    copyToClipboard(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  /* ════════════════════════════════════════════════════════════
     DETAIL VIEW
     ════════════════════════════════════════════════════════════ */
  if (selected) {
    const sc = statusConfig[selected.status] || statusConfig["confirmed"];
    const isPaid = selected.paymentSummary.paid > 0;
    const isFulfilled = selected.fulfillment != null;

    // Which actions are available
    const canApprove = selected.status === "pending_approval";
    const canSendLink = selected.status === "approved";
    const canMarkPaid = selected.status === "payment_link_sent";
    const canPack = selected.status === "confirmed" && !selected.manualDelivery;
    const canDispatch = selected.status === "packed" && !selected.manualDelivery;
    const isManualMode = selected.manualDelivery && selected.status !== "delivered";
    const canCancelDashboard = ["confirmed", "packed", "dispatched"].includes(selected.status) && !selected.manualDelivery;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-3">
          <button
            onClick={() => { setSelectedId(null); setStatusDropdownOpen(false); }}
            className="p-2 rounded-[10px] hover:bg-muted transition-colors text-muted-foreground mt-0.5"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 style={{ fontSize: "22px", fontWeight: 700 }}>{selected.id}</h1>
              <span className={`px-2.5 py-1 rounded-full ${sc.bg} ${sc.color}`} style={{ fontSize: "12px", fontWeight: 600 }}>
                {sc.label}
              </span>
              {isPaid && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 flex items-center gap-1" style={{ fontSize: "12px", fontWeight: 600 }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Paid
                </span>
              )}
              {!isPaid && selected.status !== "rejected" && (
                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 flex items-center gap-1" style={{ fontSize: "12px", fontWeight: 600 }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Unpaid
                </span>
              )}
              {isFulfilled && (
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 flex items-center gap-1" style={{ fontSize: "12px", fontWeight: 600 }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />Fulfilled
                </span>
              )}
              {selected.manualDelivery && selected.status !== "delivered" && (
                <span className="px-2.5 py-1 rounded-full bg-orange-50 text-orange-700" style={{ fontSize: "12px", fontWeight: 600 }}>
                  <Hand className="w-3 h-3 inline mr-1" />Manual Delivery
                </span>
              )}
              {selected.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground" style={{ fontSize: "11px", fontWeight: 500 }}>
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-muted-foreground mt-1" style={{ fontSize: "13px" }}>
              {selected.placedAt} from <Store className="w-3 h-3 inline mx-0.5" /> {selected.channel}
            </p>
          </div>
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-5">

            {/* ─── Actions (at top) ─── */}
            {(canApprove || canSendLink || canMarkPaid || canPack || canDispatch || isManualMode || selected.status === "refund_requested") && (
              <div className="bg-card rounded-[12px] border border-border shadow-sm p-5">
                <h3 style={{ fontSize: "14px", fontWeight: 600 }} className="mb-4">Actions</h3>
                <div className="flex flex-wrap gap-3">
                  {canApprove && (
                    <>
                      <button
                        onClick={() => handleApprove(selected.id)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#220E92] text-white hover:bg-[#220E92]/90 transition-colors"
                        style={{ fontSize: "14px", fontWeight: 500 }}
                      >
                        <CircleCheck className="w-4 h-4" /> Approve Order
                      </button>
                      <button
                        onClick={() => handleReject(selected.id)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                        style={{ fontSize: "14px", fontWeight: 500 }}
                      >
                        <CircleX className="w-4 h-4" /> Reject Order
                      </button>
                    </>
                  )}
                  {canSendLink && (
                    <button
                      onClick={() => handleSendPaymentLink(selected.id)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#220E92] text-white hover:bg-[#220E92]/90 transition-colors"
                      style={{ fontSize: "14px", fontWeight: 500 }}
                    >
                      <Link2 className="w-4 h-4" /> Send Payment Link
                    </button>
                  )}
                  {canMarkPaid && (
                    <button
                      onClick={() => handlePaymentComplete(selected.id)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                      style={{ fontSize: "14px", fontWeight: 500 }}
                    >
                      <CreditCard className="w-4 h-4" /> Mark Payment Complete
                    </button>
                  )}
                  {canPack && (
                    <button
                      onClick={() => handleNextFulfillment(selected.id)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#220E92] text-white hover:bg-[#220E92]/90 transition-colors"
                      style={{ fontSize: "14px", fontWeight: 500 }}
                    >
                      <Package className="w-4 h-4" /> Mark as Packed
                    </button>
                  )}
                  {canDispatch && (
                    <button
                      onClick={() => handleNextFulfillment(selected.id)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#220E92] text-white hover:bg-[#220E92]/90 transition-colors"
                      style={{ fontSize: "14px", fontWeight: 500 }}
                    >
                      <Truck className="w-4 h-4" /> Mark as Dispatched
                    </button>
                  )}
                  {canCancelDashboard && (
                    <button
                      onClick={() => handleCancelDashboardDelivery(selected.id)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] border border-orange-200 text-orange-700 hover:bg-orange-50 transition-colors"
                      style={{ fontSize: "14px", fontWeight: 500 }}
                    >
                      <Ban className="w-4 h-4" /> Cancel Dashboard Delivery
                    </button>
                  )}
                  {isManualMode && (
                    <div className="relative">
                      <button
                        onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-orange-600 text-white hover:bg-orange-700 transition-colors"
                        style={{ fontSize: "14px", fontWeight: 500 }}
                      >
                        <Hand className="w-4 h-4" /> Update Delivery Status
                        <ChevronDown className={`w-4 h-4 transition-transform ${statusDropdownOpen ? "rotate-180" : ""}`} />
                      </button>
                      {statusDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 w-56 bg-card rounded-[12px] border border-border shadow-lg z-20 py-1.5">
                          {manualStatuses.map((ms) => (
                            <button
                              key={ms.id}
                              onClick={() => handleManualStatusChange(selected.id, ms.id)}
                              className="w-full text-left px-4 py-2.5 hover:bg-muted transition-colors flex items-center gap-3"
                              style={{ fontSize: "13px" }}
                            >
                              <div
                                className="w-2.5 h-2.5 rounded-full"
                                style={{
                                  backgroundColor:
                                    ms.id === "packed" ? "#d97706"
                                    : ms.id === "dispatched" ? "#7c3aed"
                                    : ms.id === "out_for_delivery" ? "#2563eb"
                                    : "#059669",
                                }}
                              />
                              <span style={{ fontWeight: 500 }}>{ms.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {selected.status === "refund_requested" && (
                    <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-red-500 text-white hover:bg-red-600 transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>
                      <RefreshCw className="w-4 h-4" /> Process Refund
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ─── Fulfillment Card (if exists) ─── */}
            {selected.fulfillment && (
              <div className="bg-card rounded-[12px] border border-border shadow-sm">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <div className="flex items-center gap-2.5">
                    <SquareCheck className="w-4 h-4 text-muted-foreground" />
                    <span style={{ fontSize: "14px", fontWeight: 600 }}>
                      Fulfilled ({selected.lineItems.reduce((s, l) => s + l.qty, 0)})
                    </span>
                  </div>
                  <span className="text-muted-foreground" style={{ fontSize: "13px", fontWeight: 500 }}>
                    #{selected.fulfillment.id}
                  </span>
                </div>
                <div className="px-5 py-3.5 border-b border-border bg-muted/20">
                  <div className="flex items-center gap-2 mb-1">
                    {(() => {
                      const fsc = fulfillmentStatusConfig[selected.fulfillment!.status];
                      return <span className={`px-2 py-0.5 rounded ${fsc.bg} ${fsc.color}`} style={{ fontSize: "12px", fontWeight: 600 }}>{fsc.label}</span>;
                    })()}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1.5" style={{ fontSize: "13px" }}>
                    <Truck className="w-3.5 h-3.5" />
                    <span>{selected.fulfillment.shippedDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1" style={{ fontSize: "13px" }}>
                    <Package className="w-3.5 h-3.5" />
                    <span>{selected.fulfillment.carrier} tracking: </span>
                    <button
                      onClick={() => handleCopy(selected.fulfillment!.trackingNumber, "tracking")}
                      className="text-[#220E92] underline underline-offset-2 hover:text-[#220E92]/80 inline-flex items-center gap-1"
                      style={{ fontWeight: 500 }}
                    >
                      {selected.fulfillment.trackingNumber}
                      {copiedField === "tracking" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-border">
                  {selected.lineItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 px-5 py-3.5">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-border shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p style={{ fontSize: "14px", fontWeight: 500 }}>{item.name}</p>
                        <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{item.sku}</p>
                      </div>
                      <div className="text-right whitespace-nowrap" style={{ fontSize: "14px" }}>
                        <span className="text-muted-foreground">{formatCurrency(item.price)} × {item.qty}</span>
                        <span className="ml-4" style={{ fontWeight: 500 }}>{formatCurrency(item.price * item.qty)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── Line items if no fulfillment ─── */}
            {!selected.fulfillment && (
              <div className="bg-card rounded-[12px] border border-border shadow-sm">
                <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span style={{ fontSize: "14px", fontWeight: 600 }}>
                    Order Items ({selected.lineItems.reduce((s, l) => s + l.qty, 0)})
                  </span>
                </div>
                <div className="divide-y divide-border">
                  {selected.lineItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 px-5 py-3.5">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-border shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p style={{ fontSize: "14px", fontWeight: 500 }}>{item.name}</p>
                        <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{item.sku}</p>
                      </div>
                      <div className="text-right whitespace-nowrap" style={{ fontSize: "14px" }}>
                        <span className="text-muted-foreground">{formatCurrency(item.price)} × {item.qty}</span>
                        <span className="ml-4" style={{ fontWeight: 500 }}>{formatCurrency(item.price * item.qty)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── Payment Summary ─── */}
            <div className="bg-card rounded-[12px] border border-border shadow-sm">
              <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
                {isPaid ? (
                  <SquareCheck className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Clock className="w-4 h-4 text-amber-600" />
                )}
                <span style={{ fontSize: "14px", fontWeight: 600 }}>
                  {isPaid ? "Paid" : "Payment Pending"}
                </span>
              </div>
              <div className="px-5 py-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground" style={{ fontSize: "13px" }}>Subtotal</span>
                  <div className="flex items-center gap-8">
                    <span className="text-muted-foreground" style={{ fontSize: "13px" }}>{selected.lineItems.reduce((s, l) => s + l.qty, 0)} items</span>
                    <span style={{ fontSize: "14px" }}>{formatCurrency(selected.paymentSummary.subtotal)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground" style={{ fontSize: "13px" }}>Shipping</span>
                  <div className="flex items-center gap-8">
                    <span className="text-muted-foreground" style={{ fontSize: "12px" }}>
                      {selected.fulfillment ? `Express Delivery (${selected.fulfillment.weight})` : "Express Delivery"}
                    </span>
                    <span style={{ fontSize: "14px" }}>{formatCurrency(selected.paymentSummary.shipping)}</span>
                  </div>
                </div>
                {selected.paymentSummary.discount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground" style={{ fontSize: "13px" }}>Discount</span>
                    <span className="text-emerald-600" style={{ fontSize: "14px" }}>-{formatCurrency(selected.paymentSummary.discount)}</span>
                  </div>
                )}
                <div className="border-t border-border pt-2.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: "14px", fontWeight: 600 }}>Total</span>
                    <span style={{ fontSize: "16px", fontWeight: 700 }}>{formatCurrency(selected.paymentSummary.total)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground" style={{ fontSize: "13px" }}>
                      {isPaid ? "Paid by customer" : "Awaiting payment"}
                    </span>
                    <span style={{ fontSize: "14px", fontWeight: 500 }}>
                      {isPaid ? formatCurrency(selected.paymentSummary.paid) : "—"}
                    </span>
                  </div>
                </div>
                <div className="border-t border-dashed border-border pt-2.5 flex items-center justify-between">
                  <span className="text-muted-foreground" style={{ fontSize: "13px" }}>Commission (10%)</span>
                  <span className="text-red-500" style={{ fontSize: "14px", fontWeight: 500 }}>-{selected.commission}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#220E92]" style={{ fontSize: "14px", fontWeight: 600 }}>Your Earnings</span>
                  <span className="text-[#220E92]" style={{ fontSize: "18px", fontWeight: 700 }}>
                    {formatCurrency(selected.paymentSummary.total - parseInt(selected.commission.replace(/[₹,]/g, "")))}
                  </span>
                </div>
              </div>
            </div>

            {/* ─── Order Progress Stepper ─── */}
            <div className="bg-card rounded-[12px] border border-border shadow-sm p-5">
              <h3 style={{ fontSize: "15px", fontWeight: 600 }} className="mb-5">Order Progress</h3>
              <div className="space-y-0">
                {selected.timeline.map((t, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-4 h-4 rounded-full shrink-0 mt-1 ${
                          t.done
                            ? t.step === "Dashboard Delivery Cancelled" || t.step === "Rejected"
                              ? "bg-red-500"
                              : "bg-[#220E92]"
                            : t.active
                            ? "bg-[#FFC100] ring-4 ring-[#FFC100]/20"
                            : "bg-border"
                        }`}
                      />
                      {i < selected.timeline.length - 1 && (
                        <div className={`w-0.5 flex-1 min-h-[32px] ${t.done ? "bg-[#220E92]/30" : "bg-border"}`} />
                      )}
                    </div>
                    <div className="pb-5">
                      <p
                        style={{ fontSize: "14px", fontWeight: t.done || t.active ? 600 : 400 }}
                        className={
                          t.step === "Dashboard Delivery Cancelled" || t.step === "Rejected"
                            ? "text-red-600"
                            : !t.done && !t.active
                            ? "text-muted-foreground"
                            : ""
                        }
                      >
                        {t.step}
                      </p>
                      {t.time && (
                        <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{t.time}</p>
                      )}
                      {t.active && !selected.manualDelivery && (
                        <p className="text-[#FFC100]" style={{ fontSize: "12px", fontWeight: 500 }}>In progress</p>
                      )}
                      {t.active && selected.manualDelivery && (
                        <p className="text-orange-600" style={{ fontSize: "12px", fontWeight: 500 }}>Awaiting manual update</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {selected.notes && (
              <div className="bg-card rounded-[12px] border border-border shadow-sm p-5">
                <h3 style={{ fontSize: "14px", fontWeight: 600 }} className="mb-2">Notes</h3>
                <p className="text-muted-foreground" style={{ fontSize: "13px" }}>{selected.notes}</p>
              </div>
            )}
          </div>

          {/* ═══ RIGHT SIDEBAR ═══ */}
          <div className="space-y-4">
            {/* Channel */}
            <div className="bg-card rounded-[12px] border border-border shadow-sm p-5">
              <h4 style={{ fontSize: "14px", fontWeight: 600 }} className="mb-3">Channel Information</h4>
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-[#220E92]" />
                <span style={{ fontSize: "14px", fontWeight: 500 }}>{selected.channel}</span>
              </div>
            </div>

            {/* Customer */}
            <div className="bg-card rounded-[12px] border border-border shadow-sm p-5">
              <h4 style={{ fontSize: "14px", fontWeight: 600 }} className="mb-3">Customer</h4>
              <div className="space-y-1 mb-4">
                <p className="text-[#220E92] cursor-pointer hover:underline" style={{ fontSize: "14px", fontWeight: 500 }}>{selected.customer}</p>
                <p className="text-muted-foreground" style={{ fontSize: "13px" }}>
                  {selected.orderCount} {selected.orderCount === 1 ? "order" : "orders"}
                </p>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span style={{ fontSize: "13px", fontWeight: 600 }}>Contact information</span>
                  <button className="p-1 hover:bg-muted rounded transition-colors">
                    <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground truncate" style={{ fontSize: "13px" }}>{selected.email}</span>
                    <button onClick={() => handleCopy(selected.email, "email")} className="shrink-0 p-0.5 hover:bg-muted rounded transition-colors">
                      {copiedField === "email" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground" style={{ fontSize: "13px" }}>{selected.phone}</span>
                    <button onClick={() => handleCopy(selected.phone, "phone")} className="shrink-0 p-0.5 hover:bg-muted rounded transition-colors">
                      {copiedField === "phone" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-card rounded-[12px] border border-border shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 style={{ fontSize: "14px", fontWeight: 600 }}>Shipping address</h4>
                <button className="p-1 hover:bg-muted rounded transition-colors">
                  <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
              <div className="space-y-0.5">
                <p style={{ fontSize: "13px", fontWeight: 500 }}>{selected.shippingAddress.name}</p>
                <p className="text-muted-foreground" style={{ fontSize: "13px" }}>{selected.shippingAddress.line1}</p>
                {selected.shippingAddress.line2 && <p className="text-muted-foreground" style={{ fontSize: "13px" }}>{selected.shippingAddress.line2}</p>}
                <p className="text-muted-foreground" style={{ fontSize: "13px" }}>{selected.shippingAddress.zip} {selected.shippingAddress.city} {selected.shippingAddress.state}</p>
                <p className="text-muted-foreground" style={{ fontSize: "13px" }}>{selected.shippingAddress.country}</p>
                <p className="text-muted-foreground mt-1" style={{ fontSize: "13px" }}>{selected.shippingAddress.phone}</p>
              </div>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(`${selected.shippingAddress.line1}, ${selected.shippingAddress.city}, ${selected.shippingAddress.state}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-[#220E92] hover:underline"
                style={{ fontSize: "12px", fontWeight: 500 }}
              >
                <MapPin className="w-3 h-3" /> View on map <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Billing */}
            <div className="bg-card rounded-[12px] border border-border shadow-sm p-5">
              <h4 style={{ fontSize: "14px", fontWeight: 600 }} className="mb-3">Billing address</h4>
              {selected.billingSameAsShipping ? (
                <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Same as shipping address</p>
              ) : selected.billingAddress ? (
                <div className="space-y-0.5">
                  <p style={{ fontSize: "13px", fontWeight: 500 }}>{selected.billingAddress.name}</p>
                  <p className="text-muted-foreground" style={{ fontSize: "13px" }}>{selected.billingAddress.line1}</p>
                  {selected.billingAddress.line2 && <p className="text-muted-foreground" style={{ fontSize: "13px" }}>{selected.billingAddress.line2}</p>}
                  <p className="text-muted-foreground" style={{ fontSize: "13px" }}>{selected.billingAddress.zip} {selected.billingAddress.city} {selected.billingAddress.state}</p>
                  <p className="text-muted-foreground" style={{ fontSize: "13px" }}>{selected.billingAddress.country}</p>
                </div>
              ) : null}
            </div>

            {/* Payment Method */}
            <div className="bg-card rounded-[12px] border border-border shadow-sm p-5">
              <h4 style={{ fontSize: "14px", fontWeight: 600 }} className="mb-3">Payment method</h4>
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                <span style={{ fontSize: "13px" }}>{selected.paymentSummary.method}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {isPaid ? (
                  <span className="inline-flex items-center gap-1 text-emerald-600" style={{ fontSize: "12px", fontWeight: 500 }}>
                    <ShieldCheck className="w-3.5 h-3.5" /> Payment verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-amber-600" style={{ fontSize: "12px", fontWeight: 500 }}>
                    <Clock className="w-3.5 h-3.5" /> Awaiting payment
                  </span>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-card rounded-[12px] border border-border shadow-sm p-5">
              <h4 style={{ fontSize: "14px", fontWeight: 600 }} className="mb-3">Order Summary</h4>
              <div className="space-y-2">
                {[
                  { label: "Items", value: String(selected.lineItems.reduce((s, l) => s + l.qty, 0)) },
                  { label: "Order Amount", value: formatCurrency(selected.paymentSummary.total) },
                  { label: "Commission (10%)", value: selected.commission },
                  { label: "Payment", value: isPaid ? selected.paymentSummary.method : "Pending" },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between">
                    <span className="text-muted-foreground" style={{ fontSize: "13px" }}>{r.label}</span>
                    <span style={{ fontSize: "14px", fontWeight: 500 }}>{r.value}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border mt-3 pt-3 flex items-center justify-between">
                <span style={{ fontSize: "14px", fontWeight: 600 }}>Your Earnings</span>
                <span className="text-[#220E92]" style={{ fontSize: "18px", fontWeight: 700 }}>
                  {formatCurrency(selected.paymentSummary.total - parseInt(selected.commission.replace(/[₹,]/g, "")))}
                </span>
              </div>
            </div>

            {/* Manual delivery info */}
            {selected.manualDelivery && selected.status !== "delivered" && (
              <div className="bg-orange-50 rounded-[12px] border border-orange-200 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Hand className="w-4 h-4 text-orange-700" />
                  <h4 style={{ fontSize: "14px", fontWeight: 600 }} className="text-orange-900">Manual Delivery Mode</h4>
                </div>
                <p className="text-orange-700" style={{ fontSize: "12px" }}>
                  Dashboard delivery has been cancelled. You are now managing delivery manually. Use the "Update Delivery Status" button to track progress.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════
     LIST VIEW
     ════════════════════════════════════════════════════════════ */
  return (
    <div className="space-y-6">
      <div>
        <h1 style={{ fontSize: "22px", fontWeight: 700 }}>Orders</h1>
        <p className="text-muted-foreground mt-0.5" style={{ fontSize: "13px" }}>
          Manage incoming and past orders
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-[10px] border border-border bg-card"
            style={{ fontSize: "14px" }}
          />
        </div>
        <div className="flex bg-muted rounded-[10px] p-1 overflow-x-auto">
          {[
            { id: "all", label: "All" },
            { id: "pending_approval", label: "Pending" },
            { id: "approved", label: "Approved" },
            { id: "payment_link_sent", label: "Awaiting Pay" },
            { id: "confirmed", label: "Confirmed" },
            { id: "packed", label: "Packed" },
            { id: "delivered", label: "Delivered" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                filter === f.id ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
              }`}
              style={{ fontSize: "13px", fontWeight: 500 }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleDownloadCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] border border-border bg-card hover:bg-muted transition-colors ml-auto"
          style={{ fontSize: "13px", fontWeight: 500 }}
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Orders table */}
      <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {["Order ID", "Customer", "Amount", "Commission", "Status", "Payment", "Actions"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-muted-foreground whitespace-nowrap" style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((o) => {
              const osc = statusConfig[o.status] || statusConfig["confirmed"];
              const isPaidRow = o.paymentSummary.paid > 0;
              return (
                <tr
                  key={o.id}
                  className="border-b border-border hover:bg-muted/20 transition-colors cursor-pointer"
                  onClick={() => setSelectedId(o.id)}
                >
                  <td className="px-5 py-3.5">
                    <p style={{ fontSize: "14px", fontWeight: 600 }}>{o.id}</p>
                    <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{o.date}</p>
                  </td>
                  <td className="px-5 py-3.5" style={{ fontSize: "14px" }}>{o.customer}</td>
                  <td className="px-5 py-3.5" style={{ fontSize: "14px", fontWeight: 500 }}>{o.amount}</td>
                  <td className="px-5 py-3.5 text-muted-foreground" style={{ fontSize: "13px" }}>{o.commission}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`px-2.5 py-1 rounded-full ${osc.bg} ${osc.color}`} style={{ fontSize: "12px", fontWeight: 600 }}>
                        {osc.label}
                      </span>
                      {o.manualDelivery && o.status !== "delivered" && (
                        <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-700" style={{ fontSize: "10px", fontWeight: 600 }}>
                          Manual
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {isPaidRow ? (
                      <span className="text-emerald-600" style={{ fontSize: "13px", fontWeight: 500 }}>Paid</span>
                    ) : (
                      <span className="text-amber-600" style={{ fontSize: "13px", fontWeight: 500 }}>Unpaid</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    {o.status === "pending_approval" ? (
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleApprove(o.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#220E92] text-white hover:bg-[#220E92]/90 transition-colors"
                          style={{ fontSize: "12px", fontWeight: 500 }}
                        >
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(o.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                          style={{ fontSize: "12px", fontWeight: 500 }}
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    ) : o.status === "approved" ? (
                      <div onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleSendPaymentLink(o.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#220E92] text-white hover:bg-[#220E92]/90 transition-colors"
                          style={{ fontSize: "12px", fontWeight: 500 }}
                        >
                          <Send className="w-3.5 h-3.5" /> Send Link
                        </button>
                      </div>
                    ) : o.status === "payment_link_sent" ? (
                      <div onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handlePaymentComplete(o.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                          style={{ fontSize: "12px", fontWeight: 500 }}
                        >
                          <CreditCard className="w-3.5 h-3.5" /> Paid
                        </button>
                      </div>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {filtered.length > 0 && (
        <Pagination
          currentPage={safeOrdersPage}
          totalPages={ordersTotalPages}
          totalItems={filtered.length}
          itemsPerPage={ORDERS_PER_PAGE}
          onPageChange={setOrdersPage}
          itemLabel="orders"
        />
      )}
    </div>
  );
}
