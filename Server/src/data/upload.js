import mongoose from "mongoose";
import { Router } from "express";
import userModel from "../models/userModel.js";
import amenityModel from "../models/amenityModel.js";
import categoryModel from "../models/categoryModel.js";
import listModel from "../models/listModel.js";
import bookingModel from "../models/bookingModel.js";
import ratingModel from "../models/ratingModel.js";
import { users } from "./users.js";
import { amenities } from "./aminites.js";
import { categories } from "./categories.js";
import { lists } from "./lists.js";
import { bookings } from "./bookings.js";
import { ratings } from "./rating.js";
const router = Router();

router.post("/upload-sample-data", handleUploadData);
async function handleUploadData(req, res) {
  try {
    // Drop existing database
    await mongoose.connection.dropDatabase();

    //  Upload Users
    for (const user of users) {
      const createdUser = await userModel.create(user); // will trigger pre('save') and hash password
    }

    // 2 Upload Amenities
    const uploadedAmenities = await amenityModel.insertMany(amenities);

    // 3 Upload Categories
    const uploadedCategories = await categoryModel.insertMany(categories);

    // 4 Upload Listings
    const uploadedListings = await listModel.insertMany(lists);

    // 5 Upload Bookings
    const uploadedBookings = await bookingModel.insertMany(bookings);

    // 6 Upload Ratings
    const uploadedRatings = await ratingModel.insertMany(ratings);

    console.log(" All sample data uploaded successfully!");

    res.status(201).json({
      success: true,
      uploadedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error uploading sample data:", error);

    // More detailed error information
    const errorDetails = {
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      name: error.name,
    };

    // Check for specific MongoDB errors
    if (error.name === "ValidationError") {
      errorDetails.validationErrors = Object.keys(error.errors).map((key) => ({
        field: key,
        message: error.errors[key].message,
      }));
    }

    if (error.code === 11000) {
      errorDetails.duplicateKey = error.keyPattern;
      errorDetails.duplicateValue = error.keyValue;
    }

    res.status(500).json({
      success: false,
      message: "Failed to upload sample data",
      error: errorDetails,
      timestamp: new Date().toISOString(),
    });
  }
}
export default router;
