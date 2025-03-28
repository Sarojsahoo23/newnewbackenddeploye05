import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import comicModel from "../models/comic.model.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create Comic
export const createComic = async (request, response) => {
    try {
        const { comicHeading, comicFirstParagraph, comicSecondParagraph } = request.body;
        console.log("Received files:", request.files); 

        // Extract images from request
        const comicFirstImage = request.files?.["comicFirstImage"]?.[0] || null;
        const comicSecondImage = request.files?.["comicSecondImage"]?.[0] || null;

        if (!comicHeading || !comicFirstParagraph || !comicSecondParagraph) {
            return response.status(400).json({ success: false, message: "All fields are required" });
        }

        if (!comicFirstImage || !comicSecondImage) {
            return response.status(400).json({ success: false, message: "Both images are required" });
        }

        // Convert images to Base64 format
        const firstImageBase64 = `data:${comicFirstImage.mimetype};base64,${comicFirstImage.buffer.toString("base64")}`;
        const secondImageBase64 = `data:${comicSecondImage.mimetype};base64,${comicSecondImage.buffer.toString("base64")}`;

        // Save data to MongoDB
        const comicData = new comicModel({
            comicHeading,
            comicFirstParagraph,
            comicSecondParagraph,
            comicFirstImage: firstImageBase64,
            comicSecondImage: secondImageBase64,
        });

        await comicData.save();

        return response.status(201).json({
            success: true,
            message: "Comic created successfully",
            data: comicData,
        });
    } catch (error) {
        return response.status(500).json({ message: error.message, success: false });
    }
};
console.log(createComic);
// Get Comic Details
export const getComicDetails = async (request, response) => {
    try {
        const comicdetailsAll = await comicModel.find().sort({ createdAt: -1 });

        return response.status(200).json({
            message: "Comics retrieved successfully",
            data: comicdetailsAll.length > 0 ? comicdetailsAll : [],
            success: true,
        });
    } catch (error) {
        console.error("Fetch Comic Details Error:", error);
        return response.status(500).json({ message: error.message, success: false });
    }
};

// Delete Comic
export const deleteComic = async (request, response) => {
    try {
        const { id } = request.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ message: "Invalid comic ID", success: false });
        }

        const comicNew = await comicModel.findById(id);
        if (!comicNew) {
            return response.status(404).json({ message: "Comic post not found", success: false });
        }

        await comicModel.findByIdAndDelete(id);

        return response.status(200).json({ message: "Comic post deleted successfully", success: true });

    } catch (error) {
        return response.status(500).json({ message: error.message, success: false });
    }
};
