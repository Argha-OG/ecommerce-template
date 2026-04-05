import { getProducts } from "@/actions/product";
import Link from "next/link";
import Pagination from "@/components/admin/Pagination";
import SearchInput from "@/components/admin/SearchInput";
import SortHeader from "@/components/admin/SortHeader";
import { Pencil } from "lucide-react";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage({ searchParams }) {
  const params = await searchParams;
  const page = parseInt(params.page) || 1;
  const q = params.q || "";
  const sortBy = params.sortBy || "createdAt";
  const order = params.order || "desc";
  const limit = 10;

  const { products, totalPages, totalCount } = await getProducts(page, limit, q, sortBy, order);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-100">
        <div>
          <h1 className="text-3xl font-serif">Product Inventory</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
            {q ? `Filtered ARCHIVE: ${totalCount} results for "${q}"` : `Active Warehouse: ${totalCount} total assets available`}
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <SearchInput isLink placeholder="Search by name, SKU or category..." />
          <Link 
            href="/admin/products/new" 
            className="w-full md:w-auto bg-zinc-900 text-white px-8 py-3 rounded-full font-bold text-xs tracking-widest uppercase hover:bg-accent transition-all shadow-lg active:scale-95 text-center"
          >
            + Add New Product
          </Link>
        </div>
      </div>

      <div className="bg-white border border-zinc-200/60 rounded-3xl shadow-sm overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 text-zinc-400 border-b border-zinc-100">
                <SortHeader label="Product / SKU" sortBy="name" currentSortBy={sortBy} currentOrder={order} isLink />
                <SortHeader label="Category" sortBy="category" currentSortBy={sortBy} currentOrder={order} isLink />
                <SortHeader label="Price" sortBy="price" currentSortBy={sortBy} currentOrder={order} isLink />
                <SortHeader label="Stock" sortBy="stock" currentSortBy={sortBy} currentOrder={order} isLink />
                <SortHeader label="SEO Status" sortBy="seoTitle" currentSortBy={sortBy} currentOrder={order} isLink />
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-24 text-center">
                    <p className="text-zinc-300 font-serif italic text-2xl mb-2">No Matches Found</p>
                    <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Adjust your search criteria to reveal more entries</p>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-zinc-50/30 transition-colors group">
                    <td className="p-8">
                      <div className="font-bold text-zinc-900 group-hover:text-zinc-500 transition-colors">{product.name}</div>
                      <div className="text-[10px] uppercase font-bold mt-1 shadow-sm w-fit border border-zinc-50 px-2 rounded-sm tracking-widest">{product.sku}</div>
                    </td>
                    <td className="p-8">
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 bg-zinc-50 px-3 py-1 rounded-full border border-zinc-100">
                         {product.category}
                       </span>
                    </td>
                    <td className="p-8 font-bold text-zinc-900 text-lg">RM {product.price.toFixed(2)}</td>
                    <td className="p-8 text-center md:text-left">
                      <span className={`px-4 py-1 text-[10px] uppercase font-black tracking-widest rounded-full border ${
                        product.stock > 3 
                          ? 'bg-green-50/50 text-green-700 border-green-100' 
                          : product.stock > 0 
                            ? 'bg-amber-50/50 text-amber-700 border-amber-100' 
                            : 'bg-red-50/50 text-red-700 border-red-100'
                      }`}>
                        {product.stock} Units
                      </span>
                    </td>
                    <td className="p-8">
                      {product.seoTitle ? (
                         <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent border border-accent/20 bg-accent/5 px-3 py-1.5 rounded-full shadow-sm">Optimized</span>
                      ) : (
                         <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-300 px-3 py-1.5">Unprocessed</span>
                      )}
                    </td>
                    <td className="p-8">
                      <div className="flex items-center justify-center gap-2">
                        <Link 
                          href={`/admin/products/${product._id}`}
                          className="p-2 text-zinc-300 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all"
                          title="Edit Product"
                        >
                          <Pencil size={18} strokeWidth={1.5} />
                        </Link>
                        <DeleteProductButton id={product._id} sku={product.sku} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination 
        currentPage={page} 
        totalPages={totalPages} 
        isLink={true}
        baseUrl="/admin/products"
      />
    </div>
  );
}



