import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Super Admin', 'Shop', 'Master', 'Tailor', 'Delivery Boy'], 
    required: true 
  },
  status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  
  // Role specific fields
  shopName: String, // For Shop
  workshopName: String, // For Master
  masterId: mongoose.Schema.Types.ObjectId, // For Tailor
  specialization: [String], // For Master, Tailor
  vehicleNumber: String, // For Delivery Boy
  
  // Wallet
  wallet: {
    mainBalance: { type: Number, default: 0 },
    growthBalance: { type: Number, default: 0 },
    todaysWorkBalance: { type: Number, default: 0 },
    rewardBalance: { type: Number, default: 0 }
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
