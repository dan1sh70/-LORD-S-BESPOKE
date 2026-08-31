import User from '../../models/User.js';

// Recursive function to build downline tree up to maxLevel
const buildDownline = async (uplineId, currentLevel, maxLevel) => {
  if (currentLevel > maxLevel) return [];

  const children = await User.find({ uplineId }).select('_id name role mobile');
  
  const tree = [];
  for (let child of children) {
    const downline = await buildDownline(child._id, currentLevel + 1, maxLevel);
    tree.push({
      ...child.toObject(),
      level: currentLevel,
      downline
    });
  }
  
  return tree;
};

// @desc    Get user's 10-level referral tree
// @route   GET /api/referral/me/tree
// @access  Private
export const getMyTree = async (req, res) => {
  try {
    const tree = await buildDownline(req.user._id, 1, 10);
    res.json({ success: true, data: tree });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching referral tree', error: error.message });
  }
};
