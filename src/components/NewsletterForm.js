"use client";

export default function NewsletterForm() {
  return (
    <form 
      className="flex flex-col sm:flex-row gap-4" 
      onSubmit={(e) => { 
        e.preventDefault(); 
        alert("Subscribed to the Zynzyr VIP List!"); 
      }}
    >
      <input 
        type="email" 
        required 
        placeholder="Enter your email address" 
        className="flex-1 p-4 border border-border bg-background focus:outline-none focus:border-accent"
      />
      <button type="submit" className="bg-foreground text-background px-8 py-4 font-bold tracking-widest uppercase hover:bg-accent transition-colors">
        Subscribe
      </button>
    </form>
  );
}
