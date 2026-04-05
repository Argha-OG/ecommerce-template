import Link from "next/link";
import { fetchExternalProducts } from "@/lib/api";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/FadeIn";
import NewsletterForm from "@/components/NewsletterForm";

export default async function Home() {
  // Fetch top 4 Fashion products from Live MongoDB
  const apiProducts = await fetchExternalProducts(null);
  const dbProducts = apiProducts.slice(0, 4);

  return (
    <div className="flex flex-col items-center">
      
      {/* 1. Immersive Hero Section */}
      <section className="relative w-full h-[90vh] flex flex-col justify-center items-center text-center px-4 overflow-hidden bg-zinc-950 text-white">
        {/* Parallax / Background Image Mock */}
        <div 
          className="absolute inset-0 z-0 opacity-60 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=2000&q=80')" }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        
        <FadeIn className="relative z-10 max-w-4xl space-y-6">
          <h1 className="text-5xl md:text-8xl font-serif tracking-tight">The Modern Muse</h1>
          <p className="text-lg md:text-2xl text-zinc-300 max-w-2xl mx-auto font-light">
            An uncompromising curation of luxury essentials and bespoke evening wear mapped uniquely for you.
          </p>
          <div className="pt-8">
            <Link href="/collections/all" className="inline-block bg-white text-black px-10 py-5 font-bold tracking-widest uppercase hover:bg-accent hover:text-white transition-all transform hover:scale-105">
              Explore Collection
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* 2. Shop By Collection Grid */}
      <section className="w-full max-w-7xl px-4 py-24">
        <FadeIn>
          <h2 className="text-4xl font-serif text-center mb-16">Curated Categories</h2>
        </FadeIn>
        
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Essentials", img: "https://images.unsplash.com/photo-1434389678248-cb580b0fb16f?w=800&q=80" },
            { title: "Evening Wear", img: "https://images.unsplash.com/photo-1566207274740-0f8cf6b7d5a5?w=800&q=80" },
            { title: "Accessories", img: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80" }
          ].map((cat, idx) => (
            <StaggerItem key={idx}>
              <Link href="/collections/all" className="group relative block aspect-[4/5] overflow-hidden bg-zinc-100">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${cat.img}')` }}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-3xl font-serif tracking-wide drop-shadow-md">{cat.title}</span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* 3. Trending Arrivals (MongoDB Wired) */}
      <section className="w-full max-w-7xl px-4 py-24 border-t border-border">
        <FadeIn className="flex justify-between items-end mb-12">
          <div>
            <span className="text-accent uppercase tracking-widest text-sm font-bold block mb-2">New Drops</span>
            <h2 className="text-4xl font-serif">Trending Arrivals</h2>
          </div>
          <Link href="/collections/all" className="hidden md:block border-b border-foreground pb-1 hover:text-accent hover:border-accent transition-colors font-medium">
            View All Pieces
          </Link>
        </FadeIn>
        
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {dbProducts.length > 0 ? (
            dbProducts.map((product) => (
              <StaggerItem key={product._id}>
                <Link href={`/product/${product.sku || '0000'}`} className="group cursor-pointer block text-left">
                  <div className="w-full aspect-3/4 bg-zinc-200 mb-4 overflow-hidden relative border border-border">
                     {product.images && product.images[0] ? (
                       <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                     ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 font-serif bg-muted">
                            <span className="text-3xl mb-2">ZYNZYR</span>
                            <span className="text-xs uppercase tracking-widest">{product.category || 'Apparel'}</span>
                        </div>
                     )}
                  </div>
                  <h3 className="font-bold text-lg mb-1 truncate">{product.name}</h3>
                  <p className="text-muted-foreground font-medium flex items-center justify-between">
                     <span>RM {product.price.toFixed(2)}</span>
                     {product.stock <= 3 && product.stock > 0 && <span className="text-xs text-red-500">Only {product.stock} left!</span>}
                  </p>
                </Link>
              </StaggerItem>
            ))
          ) : (
             <div className="col-span-4 text-center text-muted-foreground py-16 border border-border bg-card rounded-md">
               <h3 className="text-xl font-serif mb-2 text-foreground">Welcome to Zynzyr Admin Environment</h3>
               <p className="max-w-md mx-auto">No products loaded yet. Access the <b>/admin</b> dashboard to start populating your MongoDB inventory database.</p>
             </div>
          )}
        </StaggerContainer>
        <div className="mt-8 text-center md:hidden">
           <Link href="/collections/all" className="inline-block border border-border px-8 py-3 hover:bg-foreground hover:text-background transition-colors">
             View All Pieces
           </Link>
        </div>
      </section>

      {/* 4. Brand Story Immersive Banner */}
      <section className="w-full bg-zinc-100 py-24 my-12 relative overflow-hidden">
        <FadeIn className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <span className="text-accent text-4xl mb-6 block">♦</span>
          <h2 className="text-3xl md:text-5xl font-serif mb-8 leading-tight text-zinc-900">
            "True luxury is not defined by complexity, but by the relentless refinement of the essential."
          </h2>
          <p className="text-zinc-600 max-w-2xl mx-auto text-lg">
            At Zynzyr, we source exclusively from premium Italian mills, focusing entirely on structural integrity and timeless silhouettes. Every stitch is rigorously inspected.
          </p>
        </FadeIn>
      </section>

      {/* 5. VIP Newsletter */}
      <section className="w-full max-w-3xl mx-auto px-4 py-24 text-center">
        <FadeIn>
          <h2 className="text-4xl font-serif mb-4">The Inner Circle</h2>
          <p className="text-muted-foreground mb-8">
            Subscribe alongside 10,000+ others to receive private invitations to our quarterly archive sales and bespoke styling advice.
          </p>
          <NewsletterForm />
        </FadeIn>
      </section>

    </div>
  );
}
