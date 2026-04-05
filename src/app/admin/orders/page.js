"use client"

import { useState, useEffect } from "react";
import { Loader2, ArrowLeft, ExternalLink, Filter, Calendar, DollarSign, Package, Trash2 } from "lucide-react";
import Link from "next/link";
import Pagination from "@/components/admin/Pagination";
import SearchInput from "@/components/admin/SearchInput";
import SortHeader from "@/components/admin/SortHeader";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import DeleteOrderButton from "@/components/admin/DeleteOrderButton";


export default function OrdersLogPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 10,
        q: searchQuery,
        sortBy,
        order: sortOrder
      });
      const res = await fetch(`/api/admin/orders?${queryParams.toString()}`);
      const result = await res.json();
      setOrders(result.data || []);
      setTotalPages(result.totalPages || 1);
      setTotalCount(result.totalCount || 0);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchQuery, sortBy, sortOrder, refreshTrigger]);


  const handleSort = (field, order) => {
    setSortBy(field);
    setSortOrder(order || "desc");
    setCurrentPage(1); // Reset to page 1 on new sort
  };

  const handleSearch = (q) => {
    setSearchQuery(q);
    setCurrentPage(1); // Reset to page 1 on new search
  };



  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-zinc-900 animate-spin opacity-20" />
        <p className="font-serif italic text-muted-foreground tracking-wide">Retrieving Orders Ledger...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      <header className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-8 border-b border-zinc-100">
        <div>
          <Link href="/admin" className="text-xs uppercase tracking-widest font-black text-zinc-400 hover:text-zinc-900 flex items-center gap-2 mb-4 transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif text-zinc-900 tracking-tight">Orders Log</h1>
          <p className="text-zinc-500 font-medium uppercase tracking-[0.2em] text-[10px] mt-4">
            {searchQuery ? `Search Results: ${totalCount} records for "${searchQuery}"` : `Verified Transaction History (${totalCount} items)`}
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4">
          <SearchInput placeholder="Search client name or reference..." onSearch={handleSearch} />
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-6 py-3 bg-white border border-zinc-200 rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-zinc-50 transition-all shadow-sm">
               <Filter size={14} /> Filter
             </button>
             <button className="flex items-center gap-2 px-6 py-3 bg-white border border-zinc-200 rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-zinc-50 transition-all shadow-sm">
               <Calendar size={14} /> Export CSV
             </button>
          </div>
        </div>

      </header>

      {/* Metrics Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
         <div className="p-8 bg-zinc-50 rounded-3xl border border-zinc-100/50">
            <div className="flex items-center gap-3 mb-4 text-zinc-400">
               <Package size={18} strokeWidth={1.5} />
               <span className="text-[10px] font-black uppercase tracking-widest">Total Volume</span>
            </div>
            <p className="text-3xl font-sans font-light">{totalCount} <span className="text-sm font-medium text-zinc-400">Orders</span></p>
         </div>
         <div className="p-8 bg-zinc-50 rounded-3xl border border-zinc-100/50">
            <div className="flex items-center gap-3 mb-4 text-zinc-400">
               <DollarSign size={18} strokeWidth={1.5} />
               <span className="text-[10px] font-black uppercase tracking-widest">Gross Value</span>
            </div>
            <p className="text-3xl font-sans font-light">RM {orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toLocaleString()}</p>
         </div>
      </div>

      <div className="bg-white border border-zinc-200/60 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50">
                <SortHeader label="Reference" sortBy="_id" currentSortBy={sortBy} currentOrder={sortOrder} onSort={handleSort} />
                <SortHeader label="Customer" sortBy="customerName" currentSortBy={sortBy} currentOrder={sortOrder} onSort={handleSort} />
                <SortHeader label="Date" sortBy="createdAt" currentSortBy={sortBy} currentOrder={sortOrder} onSort={handleSort} />
                <SortHeader label="Status" sortBy="status" currentSortBy={sortBy} currentOrder={sortOrder} onSort={handleSort} />
                <SortHeader label="Total" sortBy="totalAmount" currentSortBy={sortBy} currentOrder={sortOrder} onSort={handleSort} className="text-right flex justify-end" />
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-100">
              {orders.length > 0 ? orders.map((order) => (
                <tr key={order._id} className="hover:bg-zinc-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <span className="font-bold text-zinc-900 font-mono text-xs">#{order._id.slice(-6).toUpperCase()}</span>
                    {order.whatsappReference && <span className="block text-[9px] text-accent font-bold mt-1 uppercase tracking-tighter">WA: {order.whatsappReference}</span>}
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-zinc-900 mb-0.5">{order.customerName}</p>
                    <p className="text-[10px] text-zinc-400 font-medium">{order.customerPhone}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs text-zinc-600 font-medium">{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </td>
                  <td className="px-8 py-6">
                    <OrderStatusSelect 
                      id={order._id} 
                      currentStatus={order.status} 
                      onUpdate={() => setRefreshTrigger(prev => prev + 1)}
                    />
                  </td>
                  <td className="px-8 py-6 text-right">
                    <p className="font-bold text-zinc-900">RM {(order.totalAmount || 0).toFixed(2)}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-2">
                       <button className="p-2 text-zinc-300 hover:text-zinc-900 transition-colors">
                         <ExternalLink size={16} strokeWidth={1.5} />
                       </button>
                       <DeleteOrderButton 
                        id={order._id} 
                        onDeleted={() => setRefreshTrigger(prev => prev + 1)} 
                       />
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-8 py-24 text-center">
                     <p className="font-serif text-2xl text-zinc-300 mb-2">Pristine Ledger</p>
                     <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest underline decoration-accent decoration-2 underline-offset-4">No marketplace records found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

