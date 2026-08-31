import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  
  // The 4 Buckets
  mainWallet: { type: Number, default: 0 },
  growthWallet: { type: Number, default: 0 },
  todaysWorkWallet: { type: Number, default: 0 },
  rewardWallet: { type: Number, default: 0 },
  
  // The immutable Ledger
  transactions: [{
    type: { type: String, enum: ['CREDIT', 'DEBIT'], required: true },
    bucket: { type: String, enum: ['mainWallet', 'growthWallet', 'todaysWorkWallet', 'rewardWallet'], required: true },
    amount: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    reason: { type: String, required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('Wallet', walletSchema);
