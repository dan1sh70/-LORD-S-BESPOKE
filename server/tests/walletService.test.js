import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Wallet from '../src/models/Wallet.js';
import { processTransaction } from '../src/services/walletService.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Wallet.deleteMany({});
});

describe('Wallet Service Atomic Updates', () => {

  test('Concurrent credits safely queue via findOneAndUpdate', async () => {
    const userId = new mongoose.Types.ObjectId();
    
    // Seed initial wallet
    await Wallet.create({
      userId,
      mainWallet: 0,
      growthWallet: 0,
      todaysWorkWallet: 0,
      rewardWallet: 0
    });

    // Fire 5 concurrent credit transactions of 100 each
    const promises = Array(5).fill(0).map(() => 
      processTransaction({
        userId,
        type: 'CREDIT',
        bucket: 'mainWallet',
        amount: 100,
        reason: 'Concurrent Credit Test'
      })
    );

    await Promise.all(promises);

    const finalWallet = await Wallet.findOne({ userId });
    
    // If read-modify-write lost updates occurred, this might be 100 or 200.
    // Because we use atomic $inc, it MUST be exactly 500.
    expect(finalWallet.mainWallet).toBe(500);
    expect(finalWallet.transactions.length).toBe(5);
  });

  test('Debit fails atomically if funds are insufficient', async () => {
    const userId = new mongoose.Types.ObjectId();
    
    await Wallet.create({
      userId,
      mainWallet: 50,
      growthWallet: 0,
      todaysWorkWallet: 0,
      rewardWallet: 0
    });

    await expect(processTransaction({
      userId,
      type: 'DEBIT',
      bucket: 'mainWallet',
      amount: 100,
      reason: 'Should fail'
    })).rejects.toThrow('Insufficient funds in mainWallet');

    const finalWallet = await Wallet.findOne({ userId });
    expect(finalWallet.mainWallet).toBe(50); // Untouched
  });
});
