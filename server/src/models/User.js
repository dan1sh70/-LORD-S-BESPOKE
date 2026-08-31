import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String },
  passwordHash: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['SUPER_ADMIN', 'SHOP', 'MASTER', 'TAILOR', 'DELIVERY_BOY'], 
    required: true 
  },
  status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  
  profile: {
    photo: String,
    address: String,
    city: String,
    state: String,
    pin: String,
    gstNumber: String,
    vehicleType: String,
    vehicleNumber: String,
    licenseNumber: String,
    experience: String,
    specialization: [String],
    workshopName: String
  },

  referralCode: { type: String, unique: true, sparse: true },
  uplineId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  walletId: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },

}, { timestamps: true });

// Prevent deletion if the user has a downline in the referral tree
userSchema.pre(['deleteOne', 'findOneAndDelete', 'remove'], { document: true, query: true }, async function(next) {
  const userId = this._id || this.getQuery()._id;
  if (!userId) return next();

  // We need to use mongoose.model to avoid circular dependency
  const User = mongoose.model('User');
  const hasDownline = await User.exists({ uplineId: userId });
  
  if (hasDownline) {
    const error = new Error('Cannot delete user: This user is an upline for other associates in the referral tree. Suspend them instead.');
    error.status = 400;
    return next(error);
  }
  
  next();
});

export default mongoose.model('User', userSchema);
