// orderStateMachine.js
// Single source of truth for allowed order transitions and RBAC permissions.

export const TRANSITIONS = {
  CREATED: { allowedNext: ['PICKUP_REQUESTED'], allowedRoles: ['SHOP', 'SUPER_ADMIN'] },
  PICKUP_REQUESTED: { allowedNext: ['PICKUP_ASSIGNED'], allowedRoles: ['MASTER', 'SUPER_ADMIN'] },
  PICKUP_ASSIGNED: { allowedNext: ['PICKED_UP'], allowedRoles: ['DELIVERY_BOY'] },
  PICKED_UP: { allowedNext: ['WORKSHOP_DELIVERED'], allowedRoles: ['DELIVERY_BOY'] },
  WORKSHOP_DELIVERED: { allowedNext: ['MASTER_RECEIVED'], allowedRoles: ['MASTER'] },
  MASTER_RECEIVED: { allowedNext: ['INSPECTION'], allowedRoles: ['MASTER'] },
  INSPECTION: { allowedNext: ['TAILOR_ASSIGNED'], allowedRoles: ['MASTER'] },
  TAILOR_ASSIGNED: { allowedNext: ['ACCEPTED_BY_TAILOR'], allowedRoles: ['TAILOR'] },
  ACCEPTED_BY_TAILOR: { allowedNext: ['WORK_STARTED'], allowedRoles: ['TAILOR'] },
  WORK_STARTED: { allowedNext: ['WORK_IN_PROGRESS', 'WORK_COMPLETED'], allowedRoles: ['TAILOR'] },
  WORK_IN_PROGRESS: { allowedNext: ['WORK_IN_PROGRESS', 'WORK_COMPLETED'], allowedRoles: ['TAILOR'] },
  WORK_COMPLETED: { allowedNext: ['QUALITY_CHECK'], allowedRoles: ['MASTER'] },
  QUALITY_CHECK: { allowedNext: ['QC_PASSED', 'QC_FAILED'], allowedRoles: ['MASTER'] },
  QC_FAILED: { allowedNext: ['RETURNED_TO_TAILOR'], allowedRoles: ['MASTER'] },
  RETURNED_TO_TAILOR: { allowedNext: ['WORK_STARTED'], allowedRoles: ['TAILOR'] }, // Rework loop
  QC_PASSED: { allowedNext: ['READY_FOR_DELIVERY'], allowedRoles: ['MASTER'] },
  READY_FOR_DELIVERY: { allowedNext: ['RETURN_PICKUP_ASSIGNED'], allowedRoles: ['MASTER', 'SUPER_ADMIN'] },
  RETURN_PICKUP_ASSIGNED: { allowedNext: ['COLLECTED_FROM_WORKSHOP'], allowedRoles: ['DELIVERY_BOY'] },
  COLLECTED_FROM_WORKSHOP: { allowedNext: ['DELIVERED_TO_SHOP'], allowedRoles: ['DELIVERY_BOY'] },
  DELIVERED_TO_SHOP: { allowedNext: ['CUSTOMER_DELIVERED'], allowedRoles: ['SHOP'] },
  CUSTOMER_DELIVERED: { allowedNext: ['ORDER_CLOSED'], allowedRoles: ['SHOP', 'SUPER_ADMIN'] },
  ORDER_CLOSED: { allowedNext: [], allowedRoles: [] }
};

export const assertTransition = (currentStatus, nextStatus, userRole) => {
  const rules = TRANSITIONS[currentStatus];
  
  if (!rules) {
    throw new Error(`Invalid current status: ${currentStatus}`);
  }
  
  if (!rules.allowedNext.includes(nextStatus)) {
    throw new Error(`Illegal state transition from ${currentStatus} to ${nextStatus}.`);
  }
  
  if (!rules.allowedRoles.includes(userRole)) {
    throw new Error(`Role ${userRole} is not permitted to trigger transition to ${nextStatus}.`);
  }
  
  return true;
};
