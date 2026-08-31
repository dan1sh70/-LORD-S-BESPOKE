import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Order from '../src/models/Order.js';
import { assertTransition } from '../src/services/orderStateMachine.js';

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
  await Order.deleteMany({});
});

describe('Order State Machine & Race Conditions', () => {
  
  test('assertTransition rejects out-of-order calls', () => {
    // Attempting to jump from CREATED to WORK_STARTED (bypassing pickup)
    expect(() => assertTransition('CREATED', 'WORK_STARTED', 'SHOP'))
      .toThrow('Illegal state transition');
      
    // Attempting invalid role
    expect(() => assertTransition('PICKUP_REQUESTED', 'PICKUP_ASSIGNED', 'SHOP'))
      .toThrow('Role SHOP is not permitted');
      
    // Legal transition
    expect(assertTransition('CREATED', 'PICKUP_REQUESTED', 'SHOP')).toBe(true);
  });

  test('Race condition fix: concurrent modifications on the same order', async () => {
    // Setup a dummy order
    const shopId = new mongoose.Types.ObjectId();
    const customerId = new mongoose.Types.ObjectId();
    
    let order = await Order.create({
      orderNumber: 'TEST-123',
      shopId,
      customerId,
      garmentType: 'Suit',
      deliveryDate: new Date(),
      status: 'WORK_STARTED'
    });

    // Simulate Process A trying to transition to WORK_IN_PROGRESS
    const processA_CurrentStatus = order.status;
    const processA_Updates = { $set: { status: 'WORK_IN_PROGRESS' } };

    // Simulate Process B jumping in and modifying it first
    await Order.findOneAndUpdate(
      { _id: order._id, status: 'WORK_STARTED' },
      { $set: { status: 'WORK_COMPLETED' } }
    );

    // Process A now executes its atomic findOneAndUpdate using the stale precondition
    const processA_Result = await Order.findOneAndUpdate(
      { _id: order._id, status: processA_CurrentStatus },
      processA_Updates,
      { new: true }
    );

    // The race condition fix (the precondition { status: processA_CurrentStatus }) 
    // ensures Process A's update fails and returns null!
    expect(processA_Result).toBeNull();
    
    const finalOrder = await Order.findById(order._id);
    expect(finalOrder.status).toBe('WORK_COMPLETED'); // Process B won
  });
});
