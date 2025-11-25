import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

const addProduct = async (req, res) => {
  try {
    const {
      name,
      product_description,
      product_price,
      status,
      product_discount,
      inventory_quantity,
      product_category,
      final_price,
    } = req.body;

    // Check if category exists
    const categoryExists = await Category.findById(product_category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    // Check if product with same name exists
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res
        .status(400)
        .json({ message: "Product with this name already exists" });
    }

    // Upload image if exists
    let images = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await uploadOnCloudinary(file.path);
        images.push(uploaded);
      }
    }

    // Create product
    const newProduct = new Product({
      name,
      product_description,
      product_price,
      product_image: images,
      status: status || "in_stock",
      product_rating: 0,
      product_discount: product_discount || 0,
      inventory_quantity: inventory_quantity || 0,
      product_category,
      final_price,
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Error adding product", error });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("product_category");

    // Auto-fix status on fetch
    const updatedProducts = await Promise.all(
      products.map(async (product) => {
        let newStatus =
          product.inventory_quantity === 0 ? "out_of_stock" : "in_stock";

        if (product.status !== newStatus) {
          product.status = newStatus;
          await product.save();
        }

        return product;
      })
    );

    res.json({
      count: updatedProducts.length,
      products: updatedProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Cloudinary image delete with full safety
    if (product.product_image && Array.isArray(product.product_image)) {
      for (const img of product.product_image) {
        try {
          await cloudinary.uploader.destroy(img.public_id);
        } catch (err) {
          console.log("Cloudinary delete failed:", err);
        }
      }
    }

    await Product.findByIdAndDelete(id);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Error deleting product", error });
  }
};

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category exists
    if (req.body.product_category) {
      const categoryExists = await Category.findById(req.body.product_category);
      if (!categoryExists) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
    }

    // Find existing product
    const productExists = await Product.findById(id);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Handle new image upload
    if (req.files && req.files.length > 0) {
      // delete old images
      for (const img of productExists.product_image) {
        await cloudinary.uploader.destroy(img.public_id);
      }

      // upload new images
      let uploadedImages = [];
      for (const file of req.files) {
        const uploaded = await uploadOnCloudinary(file.path);
        uploadedImages.push(uploaded);
      }

      req.body.product_image = uploadedImages;
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate("product_category");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
};

const getProductByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const products = await Product.find({ product_category: categoryId });

    res.json({
      count: products.length,
      products,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products by category", error });
  }
};

export {
  addProduct,
  getAllProducts,
  deleteProduct,
  editProduct,
  getProductById,
  getProductByCategory,
};
