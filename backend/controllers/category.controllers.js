import express from "express";
import { Category } from "../models/category.model.js";

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

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category_description, isActive } = req.body;

    const updateCategory = await Category.findByIdAndUpdate(id, {
      name,
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

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

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

export { createCategory, updateCategory, deleteCategory , getAllCategories};
