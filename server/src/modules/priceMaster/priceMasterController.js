import PriceMaster from '../../models/PriceMaster.js';

// @desc    Get price matrix
// @route   GET /api/price-master
// @access  Private
export const getPrices = async (req, res) => {
  try {
    const prices = await PriceMaster.find();
    res.json({ success: true, data: prices });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching prices', error: error.message });
  }
};

// @desc    Update or create a price entry
// @route   PATCH /api/admin/price-master
// @access  Private (SUPER_ADMIN)
export const updatePrice = async (req, res) => {
  try {
    const { garmentType, alterationType, urgencyTier, price } = req.body;
    
    const entry = await PriceMaster.findOneAndUpdate(
      { garmentType, alterationType, urgencyTier },
      { price },
      { new: true, upsert: true }
    );
    
    res.json({ success: true, data: entry });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating price', error: error.message });
  }
};
