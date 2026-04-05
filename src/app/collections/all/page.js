import { fetchExternalProducts } from "@/lib/api";
import ShopClient from "@/components/shop/ShopClient";

export const metadata = {
  title: "All Collections | Zynzyr Premium Fashion",
  description: "Browse the complete collection of Zynzyr's premium boutique fashion. Discover exclusive, limited-run pieces curated for the modern muse.",
};

export default async function CollectionsPage() {
  // Fetch ALL products from the database, not just "Fashion & Apparel"
  const products = await fetchExternalProducts(null);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-5xl font-serif mb-4 tracking-tight">Complete Collection</h1>
        <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
          Explore our entire catalog of curated luxury pieces. Each item is crafted with intense attention to detail, utilizing premium materials to ensure timeless elegance.
        </p>
      </div>

      {/* Powerful Real-time Shop Client Component */}
      <ShopClient initialProducts={products} />
    </div>
  );
}
