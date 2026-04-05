import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full bg-primary text-primary-foreground py-12 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-serif text-xl font-bold mb-4">ZYNZYR</h3>
          <p className="text-sm opacity-80">Premium fashion curated for you. Elevate your daily wear with elegance.</p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Shop</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link href="/collections/all">All Products</Link></li>
            <li><Link href="/collections/new">New Arrivals</Link></li>
            <li><Link href="/collections/bestsellers">Bestsellers</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Support</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/shipping">Shipping & Returns</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Connect</h4>
          <p className="text-sm opacity-80 mb-2">Join our newsletter for exclusive offers.</p>
          <div className="flex gap-2">
             <input type="email" placeholder="Your Email" className="bg-primary-foreground/10 px-3 py-2 text-sm w-full outline-none" />
             <button className="bg-accent text-accent-foreground px-4 py-2 font-bold text-sm">Join</button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-8 border-t border-primary-foreground/10 text-sm opacity-60 text-center">
        &copy; {new Date().getFullYear()} Zynzyr. Premium Fashion. All rights reserved.
      </div>
    </footer>
  );
}
