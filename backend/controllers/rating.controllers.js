import { Rating } from "../models/rating.model.js";
import { Product } from "../models/product.model.js";

export const rateProduct = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { productId, rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Invalid rating value" });
    }

    // User already rated?
    const existing = await Rating.findOne({ user: userId, product: productId });
    if (existing) {
      return res.status(400).json({ message: "You already rated this product" });
    }

    // Add rating document
    const newRating = await Rating.create({
      user: userId,
      product: productId,
      rating
    });

    // Update average rating in Product model
    const ratings = await Rating.find({ product: productId });
    const average = ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;

    await Product.findByIdAndUpdate(productId, {
      product_rating: average,
      ratingsCount: ratings.length
    });

    res.status(200).json({
      message: "Product rated successfully",
      rating: newRating
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};