import { request, response } from "express";
import promoModel from "../models/promotional.model.js";
import multer from "multer";


const storage = multer.memoryStorage();
const upload = multer({ storage });
export const createPromotionalDetails = async (req, res) => {
    try {
        const { promoName, promoDate, promoLink } = req.body;
        const promoImage = req.file; // Use `req.file` instead of `req.files["promoImage"]`

        if (!promoName || !promoDate || !promoLink) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if (!promoImage) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }

        // Convert image to base64
        const promoImageBase64 = `data:${promoImage.mimetype};base64,${promoImage.buffer.toString("base64")}`;

        const promoData = new promoModel({
            promoName,
            promoDate: new Date(promoDate),
            promoLink,
            promoImage: promoImageBase64
        });

        await promoData.save();

        return res.status(201).json({ success: true, message: "Promotional data created successfully", data: promoData });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};



export const getPromotionalData = async (request, response) => {
    try {

        const promoDetailsAll = await promoModel.find().sort({ createdAt: -1 });

        return response.status(200).json({
            message: "Promotional data retrieved successfully",
            data: promoDetailsAll.length > 0 ? promoDetailsAll : [],
            success: true,
        });
    } catch (error) {
        return response.status(500).json({
            message: "Promotional details could not be fetched",
            error: error.message,  
            success: false
        });
    }
};


export const deletePromotionalDetails = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete and check if the post exists in one step
        const deletedPromo = await promoModel.findByIdAndDelete(id);

        if (!deletedPromo) {
            return res.status(404).json({
                message: "Promotional post not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Promotional post deleted successfully",
            success: true
        });

    } catch (error) {
        return res.status(500).json({ 
            message: error.message, 
            success: false 
        });
    }
};

