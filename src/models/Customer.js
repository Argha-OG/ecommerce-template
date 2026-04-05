import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String },
    totalLifetimeValue: { type: Number, default: 0 },
    numberOfOrders: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
