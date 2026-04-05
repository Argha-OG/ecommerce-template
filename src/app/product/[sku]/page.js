import { JsonLd, generateProductSchema } from "@/components/seo/JsonLd";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import { fetchExternalProducts } from "@/lib/api";
import ProductGallery from "@/components/shop/ProductGallery";
import ProductSuggestions from "@/components/shop/ProductSuggestions";
import { ChevronRight, ShieldCheck, Zap, RefreshCw } from "lucide-react";

export async function generateMetadata({ params }) {
  const { sku } = await params;
  const products = await fetchExternalProducts(null);
  const product = products.find(p => p.sku === sku);

  if (!product) {
    return { title: "Product Not Found | Zynzyr" };
  }

  return {
    title: product.seoTitle || `${product.name} | Zynzyr`,
    description: product.seoDescription || product.description,
    openGraph: {
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.description,
    },
  };
}

export default async function ProductPage({ params }) {
  const { sku } = await params;
  const products = await fetchExternalProducts(null);
  const product = products.find(p => p.sku === sku);

  // If testing with empty DB, return a mock product instead
  const displayProduct = product || {
    name: "Mock Signature Piece",
    description: "An elegant masterclass in minimalist design. This signature piece features a bespoke cut intended to fit seamlessly into any modern wardrobe. Handcrafted with the finest Italian silks.",
    price: 350.00,
    sku: sku,
    stock: 5,
    category: "Apparel",
    images: [] // Placeholder
  };

  const schemaData = generateProductSchema(displayProduct);

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <JsonLd data={schemaData} />
        
        {/* Breadcrumbs */}
        <nav className="flex items-center mb-10 text-muted-foreground uppercase tracking-wider text-xs font-semibold">
           <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
           <ChevronRight size={14} className="mx-2" />
           <Link href="/collections/all" className="hover:text-foreground transition-colors">Shop</Link>
           <ChevronRight size={14} className="mx-2" />
           <span className="text-foreground">{displayProduct.name}</span>
        </nav>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Gallery (Left: 7 cols) */}
          <div className="md:col-span-7">
            <ProductGallery images={displayProduct.images} fallbackName={displayProduct.name} category={displayProduct.category} />
          </div>

          {/* Product Info (Right: 5 cols) */}
          <div className="md:col-span-5 flex flex-col md:sticky md:top-24">
            
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full">{displayProduct.category || "Apparel"}</span>
              <span className="text-xs uppercase tracking-widest text-zinc-400 font-mono">SKU: {displayProduct.sku}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-[1.1] tracking-tight text-zinc-900">{displayProduct.name}</h1>
            <p className="text-3xl font-light mb-10 text-zinc-800">RM {displayProduct.price.toFixed(2)}</p>
            
            <div className="prose prose-zinc prose-p:font-light prose-p:leading-relaxed mb-10 max-w-none text-zinc-600">
              <p>{displayProduct.description}</p>
            </div>
            
            <div className="mb-10 p-5 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-between shadow-sm">
              <span className="text-sm font-bold uppercase tracking-wider text-zinc-700">Availability</span>
              {displayProduct.stock > 0 ? (
                 <span className="text-green-700 font-medium flex items-center bg-green-100 px-3 py-1 rounded-full text-sm">
                   <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                   In Stock ({displayProduct.stock} left)
                 </span>
              ) : (
                 <span className="text-red-700 font-medium flex items-center bg-red-100 px-3 py-1 rounded-full text-sm">
                   <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                   Out of Stock
                 </span>
              )}
            </div>

            <div className="mb-12">
              <AddToCartButton product={displayProduct} />
            </div>
            
            {/* Value Props / Guarantee */}
            <div className="grid grid-cols-1 gap-8 pt-10 border-t border-zinc-200">
               <div className="flex items-start">
                 <ShieldCheck className="text-zinc-400 mr-5 shrink-0" size={28} strokeWidth={1.5} />
                 <div>
                   <strong className="block text-sm text-zinc-900 font-bold uppercase tracking-wider mb-1">Premium Origin</strong>
                   <p className="text-sm text-zinc-500 leading-relaxed font-light">Sourced exclusively from ethically certified luxury mills in Italy.</p>
                 </div>
               </div>
               <div className="flex items-start">
                 <Zap className="text-zinc-400 mr-5 shrink-0" size={28} strokeWidth={1.5} />
                 <div>
                   <strong className="block text-sm text-zinc-900 font-bold uppercase tracking-wider mb-1">Priority Dispatch</strong>
                   <p className="text-sm text-zinc-500 leading-relaxed font-light">Orders placed before 2 PM MYT ship the same business day.</p>
                 </div>
               </div>
               <div className="flex items-start">
                 <RefreshCw className="text-zinc-400 mr-5 shrink-0" size={28} strokeWidth={1.5} />
                 <div>
                   <strong className="block text-sm text-zinc-900 font-bold uppercase tracking-wider mb-1">Seamless Returns</strong>
                   <p className="text-sm text-zinc-500 leading-relaxed font-light">14-day unworn return policy. We process refunds directly to your original payment method.</p>
                 </div>
               </div>
            </div>

          </div>
        </div>

        {/* Intelligent Auto Suggestions */}
        <ProductSuggestions products={products} currentSku={displayProduct.sku} category={displayProduct.category} />

      </div>
    </div>
  );
}
