"use client"

import { useState, useEffect } from "react";
import { generateInvoice } from "@/lib/InvoiceGenerator";
import { Loader2, DollarSign, ShoppingCart, Users, ExternalLink, Plus } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
        <Loader2 className="w-12 h-12 text-zinc-900 animate-spin opacity-20" />
        <p className="font-serif italic text-muted-foreground tracking-wide">Syncing Zynzyr Assets...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <header className="mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-serif text-zinc-900 tracking-tight">Executive Dashboard</h1>
        <p className="text-zinc-500 font-medium uppercase tracking-[0.2em] text-[10px] mt-4">Real-time Enterprise Performance</p>
      </header>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="relative p-8 border border-zinc-200/60 rounded-3xl bg-white transition-all hover:shadow-xl hover:-translate-y-1 group overflow-hidden">
          <div className="absolute top-4 right-4 text-zinc-100 group-hover:text-zinc-900/5 transition-colors">
             <DollarSign size={64} strokeWidth={0.5} />
          </div>
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] mb-4">Gross Revenue</h3>
          <p className="text-4xl font-sans font-light text-zinc-900">RM {(stats?.totalSales || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
        
        <div className="relative p-8 border border-zinc-200/60 rounded-3xl bg-white transition-all hover:shadow-xl hover:-translate-y-1 group overflow-hidden">
          <div className="absolute top-4 right-4 text-zinc-100 group-hover:text-zinc-900/5 transition-colors">
             <ShoppingCart size={64} strokeWidth={0.5} />
          </div>
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] mb-4">Pending Orders</h3>
          <p className="text-4xl font-sans font-light text-zinc-900">{stats?.activeOrdersCount || 0}</p>
        </div>

        <div className="relative p-8 border border-zinc-200/60 rounded-3xl bg-white transition-all hover:shadow-xl hover:-translate-y-1 group overflow-hidden">
          <div className="absolute top-4 right-4 text-zinc-100 group-hover:text-zinc-900/5 transition-colors">
             <Users size={64} strokeWidth={0.5} />
          </div>
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] mb-4">Verified Clients</h3>
          <p className="text-4xl font-sans font-light text-zinc-900">{stats?.totalClientsCount || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* Recent Orders List */}
         <div className="lg:col-span-2 p-8 border border-zinc-200/60 rounded-3xl bg-white">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-2xl font-serif text-zinc-900">Recent Marketplace Orders</h3>
               <button className="text-[10px] uppercase tracking-widest font-black text-zinc-900 hover:opacity-60 flex items-center gap-2 bg-zinc-50 px-4 py-2 rounded-full transition-all">
                  View Archive <ExternalLink size={12} />
               </button>
            </div>
            
            <div className="space-y-2">
               {(stats?.recentOrders || []).length > 0 ? (
                 stats.recentOrders.map(order => (
                   <div key={order._id} className="flex justify-between items-center py-5 border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50 transition-colors px-4 -mx-4 rounded-2xl group">
                     <div>
                       <p className="font-bold text-zinc-900 group-hover:text-zinc-500 transition-colors">Order #{order._id.slice(-6).toUpperCase()}</p>
                       <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-1 font-bold">
                        {new Date(order.createdAt).toLocaleDateString()} &bull; {order.customerName}
                       </p>
                     </div>
                     <div className="text-right">
                       <p className="font-medium text-zinc-900 mb-1">RM {(order.totalAmount || 0).toFixed(2)}</p>
                       <span className={`text-[9px] uppercase tracking-[0.2em] font-black px-3 py-1 rounded-full border ${
                         order.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-100' : 
                         'bg-amber-50 text-amber-700 border-amber-100'
                       }`}>
                         {order.status}
                       </span>
                     </div>
                   </div>
                 ))
               ) : (
                 <div className="text-center py-16 text-zinc-300 italic bg-zinc-50/50 rounded-3xl border border-dashed border-zinc-200">
                    <p className="font-serif text-xl mb-2">Pristine Ledger</p>
                    <p className="text-xs font-bold uppercase tracking-widest">No recent transactions recorded</p>
                 </div>
               )}
            </div>
         </div>

         {/* Quick Actions Card */}
         <div className="p-10 border border-zinc-900 rounded-3xl bg-zinc-900 text-white flex flex-col justify-between overflow-hidden relative shadow-2xl">
            <div className="absolute -bottom-16 -right-16 text-white/5 rotate-12 select-none pointer-events-none">
               <DollarSign size={240} />
            </div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
                 <Plus className="text-white" size={24} />
              </div>
              <h3 className="text-2xl font-serif mb-4 tracking-tight">Operational Tools</h3>
              <p className="text-sm text-zinc-400 mb-10 leading-relaxed font-light">
                Generate 1-click legal invoices for WhatsApp clients and manual order entries. Seamlessly exported as PDF assets.
              </p>
              
              <div className="space-y-6">
                 <button 
                  onClick={() => generateInvoice({ customerName: 'Zynzyr Client', orderId: 'GEN-' + Math.floor(Math.random() * 10000) })}
                  className="w-full bg-white text-zinc-900 px-8 py-5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase hover:bg-zinc-200 transition-all transform hover:-translate-y-1 shadow-lg active:scale-95"
                >
                  Create Instant Invoice
                </button>
                <div className="pt-6 border-t border-white/5">
                   <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 text-center font-bold">System Kernel v0.1.0-alpha</p>
                </div>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
}
