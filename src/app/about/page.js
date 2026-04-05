export const metadata = {
  title: "About Zynzyr | Premium Fashion",
  description: "Learn about the heritage, quality, and people behind Zynzyr's premium fashion collections.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-serif mb-8 text-center">About Zynzyr</h1>
      <div className="prose prose-zinc prose-lg mx-auto">
        <p className="mb-6">
          Zynzyr was born from a singular vision: to make premium, boutique-quality fashion accessible
          without compromising on the materials, design, or exclusivity that define true luxury.
        </p>
        <p className="mb-6">
          Every piece in our collection is curated with the modern individual in mind—someone who values 
          sophisticated aesthetics and demands comfort in their daily wear.
        </p>
        <h2 className="text-2xl font-serif mt-12 mb-4">Our Commitment to Quality</h2>
        <p className="mb-6">
          We source directly from some of the most respected mills and artisans globally. 
          By bridging the gap between bespoke craftsmanship and modern e-commerce, 
          we ensure every garment you receive is a masterpiece of design and durability.
        </p>
      </div>
    </div>
  );
}
