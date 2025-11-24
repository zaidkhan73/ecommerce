import express from "express";
import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";

const createCategory = async (req, res, next) => {
  try {
    const { name, category_description, isActive } = req.body;

    if (!name || !category_description || isActive === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name and description are required",
      });
    }

    const existing = await Category.findOne({ name });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    const newCategory = await Category.create({
      name,
      category_description,
      isActive
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    console.log("Create Category Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // 1️⃣ Find Category
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // 2️⃣ Fetch Products of this category
    const products = await Product.find({ product_category: categoryId })
      .select("_id name product_price inventory_quantity");

    return res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      data: {
        category,
        products,
        productCount: products.length,  
      },
    });

  } catch (error) {
    console.log("Get Category Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category_description, isActive } = req.body;

    const updateCategory = await Category.findByIdAndUpdate(id, {
      category_description,
      isActive,
    });

    if (!updateCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updateCategory,
    });
  } catch (error) {
    console.log("Update Category Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: deletedCategory,
    });
  } catch (error) {
    console.log("Delete Category Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "products", // Product model ka collection name (MongoDB me lowercase + plural)
          localField: "_id",
          foreignField: "product_category",
          as: "products",
        },
      },
      {
        $addFields: {
          productCount: { $size: "$products" }, // add product count
        },
      },
      {
        $project: {
          products: 0, // optional: agar sirf count chahiye aur product details nahi
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.log("Fetch Categories Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export { createCategory, updateCategory, deleteCategory , getAllCategories, getCategoryById};
