import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  
  garmentType: { type: String, required: true },
  alterationDetails: [{
    point: { type: String }, // e.g. "Length", "Waist"
    note: { type: String }
  }],
  
  priority: { 
    type: String, 
    enum: ['NORMAL', 'URGENT', 'VERY_URGENT', 'VIP', 'FESTIVAL'],
    default: 'NORMAL'
  },
  deliveryDate: { type: Date, required: true },
  
  status: { type: String, required: true, default: 'CREATED' },
  statusHistory: [{
    status: { type: String },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String },
    timestamp: { type: Date, default: Date.now },
    note: { type: String }
  }],
  
  masterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tailorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pickupDeliveryBoyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  returnDeliveryBoyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  progressPercent: { type: Number, enum: [0, 25, 50, 75, 90, 100], default: 0 },
  
  qcResult: {
    passed: { type: Boolean },
    reason: { type: String },
    checkedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    checkedAt: { type: Date }
  },
  
  price: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ['PENDING', 'PAID'], default: 'PENDING' },
  invoiceUrl: { type: String }

}, { timestamps: true });

// Indexes for fast lookup
orderSchema.index({ shopId: 1, status: 1 });
orderSchema.index({ masterId: 1, status: 1 });
orderSchema.index({ tailorId: 1, status: 1 });

export default mongoose.model('Order', orderSchema);
