import Wallet from '../models/Wallet.js';

// Helper to ensure wallet exists, creating if necessary
export const getOrCreateWallet = async (userId, session = null) => {
  let wallet = await Wallet.findOne({ userId }).session(session);
  if (!wallet) {
    wallet = new Wallet({ userId });
    await wallet.save({ session });
  }
  return wallet;
};

// @desc Process a credit or debit.
// ALL wallet mutations MUST pass through this function.
export const processTransaction = async ({ userId, type, bucket, amount, reason, orderId = null }) => {
  if (amount <= 0) throw new Error('Amount must be positive');
  
  const session = await Wallet.startSession();
  session.startTransaction();
  
  try {
    const wallet = await getOrCreateWallet(userId, session);
    
    // 1. Atomically increment/decrement the bucket
    // For DEBIT, we use a query condition to ensure sufficient funds.
    // findOneAndUpdate applies a write lock, causing concurrent requests to queue instead of throwing WriteConflicts.
    const query = { userId };
    if (type === 'DEBIT') {
      query[bucket] = { $gte: amount };
    }

    const updatedWallet = await Wallet.findOneAndUpdate(
      query,
      { $inc: { [bucket]: type === 'CREDIT' ? amount : -amount } },
      { new: true, session }
    );

    if (!updatedWallet) {
      if (type === 'DEBIT') throw new Error(`Insufficient funds in ${bucket}`);
      throw new Error('Wallet not found');
    }

    // 2. Append to immutable ledger now that we have the exact balanceAfter
    updatedWallet.transactions.push({
      type,
      bucket,
      amount,
      balanceAfter: updatedWallet[bucket],
      reason,
      orderId
    });

    await updatedWallet.save({ session });
    await session.commitTransaction();
    session.endSession();
    
    return updatedWallet;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
