import mongoose from 'mongoose';

const priceMasterSchema = new mongoose.Schema({
  garmentType: { type: String, required: true }, // e.g., 'Shirt', 'Pant', 'Suit'
  alterationType: { type: String, required: true }, // e.g., 'Length', 'Waist'
  urgencyTier: { 
    type: String, 
    enum: ['Normal', 'Urgent', 'Very Urgent', 'VIP', 'Festival'], 
    default: 'Normal' 
  },
  price: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Ensure unique combination
priceMasterSchema.index({ garmentType: 1, alterationType: 1, urgencyTier: 1 }, { unique: true });

export default mongoose.model('PriceMaster', priceMasterSchema);
