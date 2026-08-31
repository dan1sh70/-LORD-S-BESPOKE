import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  walletType: { 
    type: String, 
    enum: ['Main', 'Growth', 'TodaysWork', 'Reward'], 
    required: true 
  },
  transactionType: { type: String, enum: ['Credit', 'Debit'], required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }, // Optional, if related to an order
  balanceAfter: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);
