import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String },
    shippingAddress: { type: String, required: true },
    
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      }
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Pending' },
    whatsappReference: { type: String } // Reference ID passed to WhatsApp
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
