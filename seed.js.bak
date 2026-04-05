const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

const productSchema = new mongoose.Schema({
  name: String,
  sku: { type: String, unique: true },
  price: Number,
  stock: Number,
  category: String,
  description: String,
  images: [String],
  seoTitle: String,
  seoDescription: String,
}, { timestamps: true });

const customerSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  totalLifetimeValue: Number,
  numberOfOrders: Number
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
  customerName: String,
  customerPhone: String,
  customerEmail: String,
  shippingAddress: String,
  items: Array,
  totalAmount: Number,
  status: String,
  whatsappReference: String
}, { timestamps: true });

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB...");
    
    const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
    const Customer = mongoose.models.Customer || mongoose.model("Customer", customerSchema);
    const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

    // Delete existing
    await Product.deleteMany({});
    await Customer.deleteMany({});
    await Order.deleteMany({});

    console.log("Cleared old products, customers, and orders.");

    const categories = ["Evening Wear", "Essentials", "Summer Collection", "Accessories", "Footwear", "Outerwear"];
    const materials = ["Silk", "Cotton", "Linen", "Cashmere", "Velvet", "Leather", "Merino", "Chiffon"];
    const baseNames = [
      "Signature Dress", "Bespoke Suit", "Pleated Trousers", 
      "Oversized Blazer", "Minimalist Tote", "Classic Trench", 
      "Knitted Sweater", "Tailored Shirt", "Silk Scarf", "Evening Gown", "Wide-Leg Pants", "Corset Top"
    ];
    
    const imagePool = [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
      "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80",
      "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=800&q=80",
      "https://images.unsplash.com/photo-1591369822096-114eff85d997?w=800&q=80",
      "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800&q=80",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80",
      "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
      "https://images.unsplash.com/photo-1550614000-4b95d4ed79ea?w=800&q=80"
    ];

    const seedData = [];
    let skuCounter = 1000;

    for (let i = 0; i < 80; i++) {
      const category = categories[i % categories.length];
      const material = materials[i % materials.length];
      const baseName = baseNames[i % baseNames.length];
      const name = `${material} ${baseName}`;
      
      const basePrice = (150 + (i * 35.5)) % 1500;
      const finalPrice = basePrice < 250 ? basePrice + 350 : basePrice;

      seedData.push({
        name: name,
        sku: `ZYN-${skuCounter}`,
        price: parseFloat(finalPrice.toFixed(2)),
        stock: (i % 8) + 2, 
        category: category,
        description: `Exquisite ${name} sculpted for the minimalist wardrobe. Rendered in premium ${material.toLowerCase()} to ensure enduring elegance. Experience tactile luxury with Zynzyr.`,
        images: [imagePool[i % imagePool.length]],
        seoTitle: `${name} | Zynzyr ${category} Lux`,
        seoDescription: `Shop the exclusive ${name}. Designed primarily for timeless minimalism and structure.`
      });
      
      skuCounter++;
    }

    const customerData = [
      { name: "Argha Cypher", phone: "+60 11-1234 5678", email: "argha@zynzyr.com", totalLifetimeValue: 2450.00, numberOfOrders: 3 },
      { name: "Sarah Wilson", phone: "+60 17-9876 5432", email: "sarah@gmail.com", totalLifetimeValue: 890.00, numberOfOrders: 1 },
      { name: "Michael Chen", phone: "+60 12-3333 4444", email: "m.chen@outlook.com", totalLifetimeValue: 12500.00, numberOfOrders: 12 }
    ];

    const orderData = [
      { 
        customerName: "Argha Cypher", customerPhone: "+60 11-1234 5678", customerEmail: "argha@zynzyr.com", 
        shippingAddress: "Unit 12, Platinum Suites, Kuala Lumpur", totalAmount: 850.00, status: "Completed", whatsappReference: "WA-8842" 
      },
      { 
        customerName: "Sarah Wilson", customerPhone: "+60 17-9876 5432", customerEmail: "sarah@gmail.com", 
        shippingAddress: "Street 4, Mont Kiara", totalAmount: 890.00, status: "Pending", whatsappReference: "WA-1102" 
      }
    ];

    await Product.insertMany(seedData);
    await Customer.insertMany(customerData);
    await Order.insertMany(orderData);

    console.log(`Successfully inserted ${seedData.length} products, ${customerData.length} customers, and ${orderData.length} orders into MongoDB!`);

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
