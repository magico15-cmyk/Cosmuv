import ProductGrid from "@/components/admin/ProductGrid";

export default function AdminDashboard() {
  return (
    <div className="p-4 md:p-6 flex-1 min-w-0 flex flex-col min-h-[calc(100vh-80px)]">
      <ProductGrid />
    </div>
  );
}
