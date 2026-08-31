import mongoose from 'mongoose';

const priceMasterSchema = new mongoose.Schema({
  garmentType: { type: String, required: true }, // e.g. "Suit", "Shirt"
  alterationType: { type: String, required: true }, // e.g. "Length", "Waist"
  urgencyTier: { 
    type: String, 
    enum: ['NORMAL', 'URGENT', 'VERY_URGENT', 'VIP', 'FESTIVAL'], 
    required: true 
  },
  price: { type: Number, required: true, min: 0 }
}, { timestamps: true });

// Prevent duplicate pricing rules for the same exact combination
priceMasterSchema.index({ garmentType: 1, alterationType: 1, urgencyTier: 1 }, { unique: true });

export default mongoose.model('PriceMaster', priceMasterSchema);
