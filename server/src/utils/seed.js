import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const seedDatabase = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tailor_erp';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB for seeding...');

    // Clear existing users
    await User.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    // Create Super Admin
    const admin = await User.create({
      name: 'System Admin',
      mobile: '9999999999',
      passwordHash,
      role: 'SUPER_ADMIN'
    });

    // Create 2 Shops
    const shop1 = await User.create({ name: 'Shop One', mobile: '9000000001', passwordHash, role: 'SHOP', profile: { address: '123 Market St' } });
    const shop2 = await User.create({ name: 'Shop Two', mobile: '9000000002', passwordHash, role: 'SHOP', profile: { address: '456 High St' } });

    // Create 2 Masters
    const master1 = await User.create({ name: 'Master Ali', mobile: '8000000001', passwordHash, role: 'MASTER', profile: { workshopName: 'Premium Alters' } });
    const master2 = await User.create({ name: 'Master Raj', mobile: '8000000002', passwordHash, role: 'MASTER', profile: { workshopName: 'Quick Fixers' } });

    // Create 4 Tailors (assigned to masters via uplineId)
    await User.create({ name: 'Tailor John', mobile: '7000000001', passwordHash, role: 'TAILOR', uplineId: master1._id });
    await User.create({ name: 'Tailor Sam', mobile: '7000000002', passwordHash, role: 'TAILOR', uplineId: master1._id });
    await User.create({ name: 'Tailor Bob', mobile: '7000000003', passwordHash, role: 'TAILOR', uplineId: master2._id });
    await User.create({ name: 'Tailor Dan', mobile: '7000000004', passwordHash, role: 'TAILOR', uplineId: master2._id });

    // Create 2 Delivery Boys
    await User.create({ name: 'Delivery Fast', mobile: '6000000001', passwordHash, role: 'DELIVERY_BOY' });
    await User.create({ name: 'Delivery Express', mobile: '6000000002', passwordHash, role: 'DELIVERY_BOY' });

    console.log('Database Seeded Successfully!');
    console.log('Admin Login: 9999999999 / password123');
    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
