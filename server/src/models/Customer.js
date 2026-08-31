import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalOrders: { type: Number, default: 0 },
  totalBusiness: { type: Number, default: 0 }
}, { timestamps: true });

// A shop shouldn't have duplicate customers by mobile
customerSchema.index({ mobile: 1, shopId: 1 }, { unique: true });

export default mongoose.model('Customer', customerSchema);
