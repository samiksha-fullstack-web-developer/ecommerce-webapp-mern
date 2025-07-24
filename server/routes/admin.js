// Import the Product model
const Product = require('../models/Product');

// Admin Dashboard Summary Route
router.get('/summary', requireAdmin, async (req, res) => {
  try {
    // Count total number of orders
    const totalOrders = await Order.countDocuments();

    // Calculate total revenue (excluding cancelled orders)
    const totalRevenueResult = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } }, // Skip cancelled orders
      { $group: { _id: null, total: { $sum: "$total" } } } // Sum up total field
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0; // Handle empty result

    // Count pending orders
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });

    // Count cancelled orders
    const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });

    // Count total registered users with role 'user'
    const totalUsers = await User.countDocuments({ role: 'user' });

    // Count total number of products
    const totalProducts = await Product.countDocuments();

    // Fetch latest 5 orders sorted by most recent
    const recentOrders = await Order.find()
      .sort({ date: -1 }) // Sort by date descending
      .limit(5) // Limit to 5 records
      .populate('user', 'username'); // Populate username from user ref

    // Send success response with all summary data
    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        pendingOrders,
        cancelledOrders,
        totalUsers,
        totalProducts,
        recentOrders,
      }
    });
  } catch (err) {
    // ⚠️ Handle errors and send error response
    console.error('❌ Admin summary fetch error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
