// Import Express framework
const express = require('express');

// Import controller functions for cart operations
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');

// Create a new Express router instance
const router = express.Router();

// Route to get the user's cart
router.get('/', getCart);

// Route to add an item to the cart
router.post('/add', addToCart);

// Route to update quantity or details of a cart item
router.put('/update', updateCartItem);

// Route to remove a specific item from the cart
router.delete('/remove', removeFromCart);

// Route to clear all items from the cart
router.delete('/clear', clearCart);

// Route to remove an item from cart manually (duplicate route, likely custom logic)
router.delete('/remove', async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    // Filter out the item to be removed
    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();

    // Populate the product details in the updated cart
    const populatedCart = await cart.populate('items.product');

    // Send updated cart response
    res.json({ success: true, cart: populatedCart.items });
  } catch (err) {
    // Handle any server errors
    console.error("Error removing cart item:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Export the router to use in other files
module.exports = router;
