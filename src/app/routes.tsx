import { lazy, Suspense, Component, type ReactNode } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { RoleProvider } from "./components/RoleContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import VendorProtectedRoute from "./components/ProtectedRoute/VendorProtectedRoute";

// ─── Lazy page imports ─────────────────────────────────────────
const OnboardingLayout = lazy(() =>
  import("./components/layouts/OnboardingLayout").then((m) => ({
    default: m.OnboardingLayout,
  }))
);
const VendorLayout = lazy(() =>
  import("./components/layouts/VendorLayout").then((m) => ({
    default: m.VendorLayout,
  }))
);
const AdminLayout = lazy(() =>
  import("./components/layouts/AdminLayout").then((m) => ({
    default: m.AdminLayout,
  }))
);

// Onboarding
const VendorBasicDetails = lazy(() =>
  import("./pages/onboarding/VendorBasicDetails").then((m) => ({
    default: m.VendorBasicDetails,
  }))
);
const StoreOperations = lazy(() =>
  import("./pages/onboarding/StoreOperations").then((m) => ({
    default: m.StoreOperations,
  }))
);
const ProductCategories = lazy(() =>
  import("./pages/onboarding/ProductCategories").then((m) => ({
    default: m.ProductCategories,
  }))
);
const BankSettlement = lazy(() =>
  import("./pages/onboarding/BankSettlement").then((m) => ({
    default: m.BankSettlement,
  }))
);
const RefundsReturns = lazy(() =>
  import("./pages/onboarding/RefundsReturns").then((m) => ({
    default: m.RefundsReturns,
  }))
);
const OffersPromotions = lazy(() =>
  import("./pages/onboarding/OffersPromotions").then((m) => ({
    default: m.OffersPromotions,
  }))
);
const TechnologyInventory = lazy(() =>
  import("./pages/onboarding/TechnologyInventory").then((m) => ({
    default: m.TechnologyInventory,
  }))
);
const ReviewDeclaration = lazy(() =>
  import("./pages/onboarding/ReviewDeclaration").then((m) => ({
    default: m.ReviewDeclaration,
  }))
);

// Vendor
const VendorDashboard = lazy(() =>
  import("./pages/vendor/VendorDashboard").then((m) => ({
    default: m.VendorDashboard,
  }))
);
const VendorProducts = lazy(() =>
  import("./pages/vendor/VendorProducts").then((m) => ({
    default: m.VendorProducts,
  }))
);
const VendorCategories = lazy(() =>
  import("./pages/vendor/VendorCategories").then((m) => ({
    default: m.VendorCategories,
  }))
);
const VendorOrders = lazy(() =>
  import("./pages/vendor/VendorOrders").then((m) => ({
    default: m.VendorOrders,
  }))
);
const VendorOffers = lazy(() =>
  import("./pages/vendor/VendorOffers").then((m) => ({
    default: m.VendorOffers,
  }))
);
const VendorAccessManagement = lazy(() =>
  import("./pages/vendor/VendorAccessManagement").then((m) => ({
    default: m.VendorAccessManagement,
  }))
);
const VendorSettings = lazy(() =>
  import("./pages/vendor/VendorSettings").then((m) => ({
    default: m.VendorSettings,
  }))
);
const VendorInventory = lazy(() =>
  import("./pages/vendor/VendorInventory").then((m) => ({
    default: m.VendorInventory,
  }))
);
const VendorOfflineOrders = lazy(() =>
  import("./pages/vendor/VendorOfflineOrders").then((m) => ({
    default: m.VendorOfflineOrders,
  }))
);

// Auth
const LoginPage = lazy(() =>
  import("./pages/auth/LoginPage")
);
const AdminDashboard = lazy(() =>
  import("./pages/admin/AdminDashboard").then((m) => ({
    default: m.AdminDashboard,
  }))
);
const AdminStores = lazy(() =>
  import("./pages/admin/AdminStores").then((m) => ({ default: m.AdminStores }))
);
const AdminCustomerHome = lazy(() =>
  import("./pages/admin/AdminCustomerHome").then((m) => ({
    default: m.AdminCustomerHome,
  }))
);
const AdminSettings = lazy(() =>
  import("./pages/admin/AdminSettings").then((m) => ({
    default: m.AdminSettings,
  }))
);
const AdminBrands = lazy(() =>
  import("./pages/admin/AdminBrands").then((m) => ({ default: m.AdminBrands }))
);
const AdminAdsInterest = lazy(() =>
  import("./pages/admin/AdminAdsInterest").then((m) => ({
    default: m.AdminAdsInterest,
  }))
);
const DesignSystem = lazy(() =>
  import("./pages/admin/DesignSystem").then((m) => ({
    default: m.DesignSystem,
  }))
);

// ─── Loading spinner ───────────────────────────────────────────
function PageLoader() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        fontFamily: "Geist, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 32,
            height: 32,
            border: "3px solid #e5e7eb",
            borderTopColor: "#220E92",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 12px",
          }}
        />
        <p style={{ color: "#717182", fontSize: 13 }}>Loading...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

// ─── Route-level error boundary ────────────────────────────────
class RouteErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, fontFamily: "Geist, sans-serif" }}>
          <h2 style={{ color: "#220E92", fontSize: 18, fontWeight: 700 }}>
            This page failed to load
          </h2>
          <pre
            style={{
              marginTop: 12,
              padding: 12,
              background: "#f5f5f5",
              borderRadius: 8,
              fontSize: 12,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              maxHeight: 200,
              overflow: "auto",
            }}
          >
            {this.state.error?.message}
          </pre>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
            }}
            style={{
              marginTop: 12,
              padding: "8px 20px",
              background: "#220E92",
              color: "white",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Wrapper: Suspense + ErrorBoundary for lazy routes ─────────
function LazyPage({ children }: { children: ReactNode }) {
  return (
    <RouteErrorBoundary>
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
    </RouteErrorBoundary>
  );
}

// Wrap a lazy component so it can be used as `Component` in route config
function wrap(LazyComp: React.LazyExoticComponent<React.ComponentType<any>>) {
  return function WrappedRoute() {
    return (
      <LazyPage>
        <LazyComp />
      </LazyPage>
    );
  };
}

// ─── Redirects ─────────────────────────────────────────────────
function RedirectToVendor() {
  return <Navigate to="/vendor" replace />;
}

function RedirectToCategories() {
  return <Navigate to="/vendor/categories" replace />;
}

function RedirectToLogin() {
  return <Navigate to="/login" replace />;
}

// ─── Root layout ───────────────────────────────────────────────
function RootLayout() {
  return (
    <RoleProvider>
      <Outlet />
    </RoleProvider>
  );
}

// Layout wrappers that include Suspense for lazy layout components
function OnboardingLayoutRoute() {
  return (
    <VendorProtectedRoute>
      <LazyPage>
        <OnboardingLayout />
      </LazyPage>
    </VendorProtectedRoute>
  );
}

function VendorLayoutRoute() {
  return (
    <VendorProtectedRoute>
      <LazyPage>
        <VendorLayout />
      </LazyPage>
    </VendorProtectedRoute>
  );
}

function AdminLayoutRoute() {
  return (
    <ProtectedRoute>
      <LazyPage>
        <AdminLayout />
      </LazyPage>
    </ProtectedRoute>
  );
}

// ─── Router ────────────────────────────────────────────────────
export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <LazyPage>
        <LoginPage role="superadmin" />
      </LazyPage>
    ),
  },
  {
    path: "/vendor-login",
    element: (
      <LazyPage>
        <LoginPage role="vendor" />
      </LazyPage>
    ),
  },
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: RedirectToLogin },
      {
        path: "onboarding",
        Component: OnboardingLayoutRoute,
        children: [
          { index: true, Component: wrap(VendorBasicDetails) },
          { path: "operations", Component: wrap(StoreOperations) },
          { path: "categories", Component: wrap(ProductCategories) },
          { path: "banking", Component: wrap(BankSettlement) },
          { path: "returns", Component: wrap(RefundsReturns) },
          { path: "offers", Component: wrap(OffersPromotions) },
          { path: "technology", Component: wrap(TechnologyInventory) },
          { path: "review", Component: wrap(ReviewDeclaration) },
        ],
      },
      // TODO: Uncomment vendor routes when vendor dashboard is ready
      // {
      //   path: "vendor",
      //   Component: VendorLayoutRoute,
      //   children: [
      //     { index: true, Component: wrap(VendorDashboard) },
      //     { path: "products", Component: wrap(VendorProducts) },
      //     { path: "products/add", Component: wrap(VendorProducts) },
      //     { path: "inventory", Component: wrap(VendorInventory) },
      //     { path: "categories", Component: wrap(VendorCategories) },
      //     { path: "subcategories", Component: RedirectToCategories },
      //     { path: "orders", Component: wrap(VendorOrders) },
      //     { path: "offline-orders", Component: wrap(VendorOfflineOrders) },
      //     { path: "offers", Component: wrap(VendorOffers) },
      //     {
      //       path: "access-management",
      //       Component: wrap(VendorAccessManagement),
      //     },
      //     { path: "settings", Component: wrap(VendorSettings) },
      //     { path: "*", Component: RedirectToVendor },
      //   ],
      // },
      {
        path: "vendor/*",
        element: <Navigate to="/onboarding" replace />,
      },
      {
        path: "admin",
        Component: AdminLayoutRoute,
        children: [
          { index: true, Component: wrap(AdminDashboard) },
          { path: "stores", Component: wrap(AdminStores) },
          { path: "brands", Component: wrap(AdminBrands) },
          { path: "customer-home", Component: wrap(AdminCustomerHome) },
          { path: "ads-interest", Component: wrap(AdminAdsInterest) },
          { path: "settings", Component: wrap(AdminSettings) },
          { path: "design-system", Component: wrap(DesignSystem) },
        ],
      },
    ],
  },
]);