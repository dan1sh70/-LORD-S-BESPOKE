import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  referralCode: { type: String, required: true, unique: true },
  uplineId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // The user who referred them
  
  // Storing the 10-level downline flatly with level identifiers for easy querying
  downline: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    level: { type: Number, min: 1, max: 10 }
  }],
  
  // Earnings from MLM
  levelIncome: [{
    level: Number,
    totalEarned: { type: Number, default: 0 }
  }],
  bonusIncome: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Referral', referralSchema);
