import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The shop that created it
  masterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Assigned workshop
  tailorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Assigned tailor
  deliveryBoyPickupId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deliveryBoyReturnId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  garmentType: { type: String, required: true },
  alterationDetails: { type: mongoose.Schema.Types.Mixed }, // JSON payload based on garment taxonomy
  price: { type: Number, required: true },
  
  status: { 
    type: String, 
    enum: [
      'Order Created', 'Pickup Requested', 'Pickup Assigned', 'Picked Up', 
      'Workshop Delivered', 'Master Received', 'Inspection', 'Tailor Assigned',
      'Accepted', 'Work Started', 'Work In Progress 25%', 'Work In Progress 50%', 
      'Work In Progress 75%', 'Work In Progress 90%', 'Work Completed',
      'QC Failed', 'Ready For Delivery', 'Delivery Boy Assigned', 
      'Collected From Workshop', 'Delivered To Shop', 'Customer Delivery', 'Order Closed'
    ],
    default: 'Order Created'
  },
  
  statusHistory: [{
    status: String,
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: String,
    timestamp: { type: Date, default: Date.now }
  }],
  
  deliveryDate: { type: Date },
  priority: { type: String, enum: ['Normal', 'Urgent', 'Very Urgent', 'VIP', 'Festival'], default: 'Normal' },
  qcResult: { type: String }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
