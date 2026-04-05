import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String }],
    category: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    stock: { type: Number, default: 0 },
    
    // Automatic SEO Fields generated on pre-save
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  { timestamps: true }
);

// Pre-save hook to generate Automatic SEO Data
ProductSchema.pre('save', function (next) {
  if (this.isModified('name') || this.isModified('description')) {
    this.seoTitle = `${this.name} | Premium Fashion | Zynzyr`;
    // Generate a 160 char snippet for meta description
    this.seoDescription = this.description.substring(0, 160).trim();
  }
  next();
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
