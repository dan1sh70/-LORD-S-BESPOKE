// Middleware to auto-inject tenant filters (shopId or masterId) onto req.tenantFilter
// This ensures that when querying collections like Orders or Customers, 
// the data is strictly isolated to the calling user if they aren't an admin.

export const scopeToTenant = (req, res, next) => {
  req.tenantFilter = {};
  
  if (req.user.role === 'SUPER_ADMIN') {
    // Admins see everything, no filter
    return next();
  }

  if (req.user.role === 'SHOP') {
    req.tenantFilter = { shopId: req.user._id };
  } else if (req.user.role === 'MASTER' || req.user.role === 'TAILOR') {
    req.tenantFilter = { masterId: req.user.role === 'MASTER' ? req.user._id : req.user.uplineId }; // Tailor uses their master's ID (upline)
  } else if (req.user.role === 'DELIVERY_BOY') {
    req.tenantFilter = { $or: [{ pickupDeliveryBoyId: req.user._id }, { returnDeliveryBoyId: req.user._id }] };
  }
  
  next();
};
