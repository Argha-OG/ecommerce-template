import Link from 'next/link';

export const metadata = {
  title: "Zynzyr Admin Panel",
  robots: "noindex, nofollow"
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-secondary flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-primary-foreground flex-shrink-0">
        <div className="p-6">
          <Link href="/admin" className="font-serif text-2xl tracking-tight">ZYNZYR Admin</Link>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2">
             <li>
               <Link href="/admin" className="block px-6 py-3 hover:bg-white/10 transition-colors">Dashboard</Link>
             </li>
             <li>
               <Link href="/admin/products" className="block px-6 py-3 hover:bg-white/10 transition-colors">Products & SEO</Link>
             </li>
             <li>
               <Link href="/admin/orders" className="block px-6 py-3 hover:bg-white/10 transition-colors">Orders Log</Link>
             </li>
             <li>
               <Link href="/admin/crm" className="block px-6 py-3 hover:bg-white/10 transition-colors">Customer CRM</Link>
             </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-background p-8 border-l border-border rounded-tl-3xl shadow-2xl mt-4">
        {children}
      </main>
    </div>
  );
}
