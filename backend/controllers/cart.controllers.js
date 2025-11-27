import { Product } from "../models/product.model.js";
import { Cart } from "../models/cart.model.js";

const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { product_id, quantity } = req.body;

    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (quantity > product.inventory_quantity) {
      return res.status(400).json({
        message: `Only ${product.inventory_quantity} units available in stock`,
      });
    }

    let cart = await Cart.findOne({ user_id: userId });

    if (!cart) {
      cart = await Cart.create({
        user_id: userId,
        items: [{
          product_id,
          quantity,
          total_price: Math.round(product.final_price * quantity)
        }],
      });
    } else {
      const index = cart.items.findIndex(
        (item) => item.product_id.toString() === product_id
      );

      if (index > -1) {
        const newQty = cart.items[index].quantity + quantity;

        if (newQty > product.inventory_quantity) {
          return res.status(400).json({
            message: `Only ${product.inventory_quantity} units available in stock`,
          });
        }

        cart.items[index].quantity = newQty;
        cart.items[index].total_price = Math.round(product.final_price * newQty);

      } else {
        cart.items.push({
          product_id,
          quantity,
          total_price: Math.round(product.final_price * quantity)
        });
      }
    }

    await cart.save();
    return res.status(200).json({ message: "Cart updated successfully", cart });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};


const deleteFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { product_id } = req.body;

    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product_id.toString() !== product_id
    );

    await cart.save();

    return res.status(200).json({ message: "Item removed", cart });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = []; // saare items remove kar diye
    await cart.save();

    return res.status(200).json({ message: "Cart cleared successfully", cart });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};




const getCartById = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user_id: userId }).populate(
      "items.product_id",
      "name product_price final_price product_image inventory_quantity"
    );

    if (!cart) {
      return res.status(200).json({ message: "No items in cart", items: [] });
    }

    // Total cart amount
    const total_cart_amount = cart.items.reduce(
      (acc, item) => acc + item.total_price,
      0
    );

    return res.status(200).json({ cart, total_cart_amount });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export { addToCart, deleteFromCart, getCartById , clearCart};
