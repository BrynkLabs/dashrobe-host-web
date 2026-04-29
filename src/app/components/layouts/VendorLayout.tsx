import { Outlet } from "react-router";
import { ProductsSidebar } from "../vendor/ProductsSidebar";
import { UnsavedChangesProvider } from "../../context/UnsavedChangesContext";

export function VendorLayout() {
  return (
    <UnsavedChangesProvider>
      <div className="min-h-screen flex bg-[#edf1ff]">
        <ProductsSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Outlet />
        </div>
      </div>
    </UnsavedChangesProvider>
  );
}
