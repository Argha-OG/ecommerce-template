"use client"

import { useState, useEffect } from "react";
import { Loader2, ArrowLeft, Users, Mail, Phone, ShoppingBag, ExternalLink, Calendar, Trash2 } from "lucide-react";
import Link from "next/link";
import Pagination from "@/components/admin/Pagination";
import SearchInput from "@/components/admin/SearchInput";
import SortHeader from "@/components/admin/SortHeader";
import DeleteCustomerButton from "@/components/admin/DeleteCustomerButton";

export default function CustomerCRMPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("totalLifetimeValue");
  const [sortOrder, setSortOrder] = useState("desc");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 10,
        q: searchQuery,
        sortBy,
        order: sortOrder
      });
      const res = await fetch(`/api/admin/crm?${queryParams.toString()}`);
      const result = await res.json();
      setCustomers(result.data || []);
      setTotalPages(result.totalPages || 1);
      setTotalCount(result.totalCount || 0);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, searchQuery, sortBy, sortOrder, refreshTrigger]);


  const handleSort = (field, order) => {
    setSortBy(field);
    setSortOrder(order || "desc");
    setCurrentPage(1);
  };

  const handleSearch = (q) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  if (loading && customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-zinc-900 animate-spin opacity-20" />
        <p className="font-serif italic text-muted-foreground tracking-wide">Retrieving Customer Directory...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      <header className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-12 border-b border-zinc-100">
        <div>
          <Link href="/admin" className="text-xs uppercase tracking-widest font-black text-zinc-400 hover:text-zinc-900 flex items-center gap-2 mb-4 transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif text-zinc-900 tracking-tight">Customer CRM</h1>
          <p className="text-zinc-500 font-medium uppercase tracking-[0.2em] text-[10px] mt-4">
            {searchQuery ? `Search Results: ${totalCount} records for "${searchQuery}"` : `Verified Client Directory (${totalCount} members)`}
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4">
          <SearchInput placeholder="Search name, email or phone..." onSearch={handleSearch} />
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-6 py-3 bg-white border border-zinc-200 rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-zinc-50 transition-all shadow-sm">
               <Users size={14} /> Segment Discovery
             </button>
             <button className="flex items-center gap-2 px-6 py-3 bg-white border border-zinc-200 rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-zinc-50 transition-all shadow-sm">
               <Calendar size={14} /> Export CRM
             </button>
          </div>
        </div>
      </header>

      {/* CRM Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
         <div className="p-8 bg-zinc-50 rounded-3xl border border-zinc-100/50">
            <div className="flex items-center gap-3 mb-4 text-zinc-400">
               <Users size={18} strokeWidth={1.5} />
               <span className="text-[10px] font-black uppercase tracking-widest">Total Clients</span>
            </div>
            <p className="text-3xl font-sans font-light">{totalCount}</p>
         </div>
         <div className="p-8 bg-zinc-50 rounded-3xl border border-zinc-100/50">
            <div className="flex items-center gap-3 mb-4 text-zinc-400">
               <ShoppingBag size={18} strokeWidth={1.5} />
               <span className="text-[10px] font-black uppercase tracking-widest">Avg Lifetime Order</span>
            </div>
            <p className="text-3xl font-sans font-light">
               RM {(customers.reduce((sum, c) => sum + (c.totalLifetimeValue || 0), 0) / (customers.length || 1)).toFixed(2)}
            </p>
         </div>
      </div>

      <div className="bg-white border border-zinc-200/60 rounded-3xl overflow-hidden shadow-sm min-h-[400px]">
        {loading && (
          <div className="flex justify-center p-4 bg-zinc-50/50 border-b border-zinc-100">
             <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 animate-pulse">Refreshing Dataset...</p>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50">
                <SortHeader label="Client Info" sortBy="name" currentSortBy={sortBy} currentOrder={sortOrder} onSort={handleSort} />
                <SortHeader label="Contact Details" sortBy="email" currentSortBy={sortBy} currentOrder={sortOrder} onSort={handleSort} />
                <SortHeader label="History" sortBy="numberOfOrders" currentSortBy={sortBy} currentOrder={sortOrder} onSort={handleSort} />
                <SortHeader label="Lifetime Value" sortBy="totalLifetimeValue" currentSortBy={sortBy} currentOrder={sortOrder} onSort={handleSort} className="text-right flex justify-end" />
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {customers.length > 0 ? customers.map((customer) => (
                <tr key={customer._id} className="hover:bg-zinc-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white font-serif text-sm">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900 text-lg">{customer.name}</p>
                        <p className="text-[9px] uppercase tracking-[0.2em] font-black text-accent">Verified Member</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors font-medium">
                        <Phone size={12} className="text-zinc-300" />
                        <span className="text-xs">{customer.phone}</span>
                      </div>
                      {customer.email && (
                        <div className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors font-medium">
                          <Mail size={12} className="text-zinc-300" />
                          <span className="text-xs">{customer.email}</span>
                        </div>
                      )}
                    </div>
                  </td>
                   <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-zinc-900 font-bold bg-zinc-50 w-fit px-3 py-1 rounded-full border border-zinc-100">
                      <ShoppingBag size={12} />
                      <span className="text-[10px] font-black tracking-widest leading-none">{customer.numberOfOrders || 0} Orders</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <p className="font-bold text-zinc-900 text-lg">RM {(customer.totalLifetimeValue || 0).toLocaleString()}</p>
                    <p className="text-[9px] text-zinc-400 font-black uppercase tracking-tighter mt-1">LTV Assets</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-2">
                       <button className="p-2 text-zinc-300 hover:text-zinc-900 transition-colors">
                          <ExternalLink size={18} strokeWidth={1} />
                       </button>
                       <DeleteCustomerButton 
                        id={customer._id} 
                        name={customer.name} 
                        onDeleted={() => setRefreshTrigger(prev => prev + 1)} 
                       />
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-8 py-24 text-center">
                     <p className="font-serif text-2xl text-zinc-300 mb-2">No Records Found</p>
                     <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Adjust your filters to discover customer profiles</p>
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


