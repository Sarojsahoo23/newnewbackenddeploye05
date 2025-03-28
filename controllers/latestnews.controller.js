import express, { request, response } from "express";
import multer from "multer";
import latestModel from "../models/latestNews.model.js"; 


// Use memory storage for Cloudinary or similar service
const storage = multer.memoryStorage();
const upload = multer({ storage });

export const createLatestNews = async (request, response) => {
    try {
        const { latestNewsHeading, latestFirstParagraph, latestSecondParagraph } = request.body;

        // Extract images from request
        const latestfirstImage = request.files?.["latestFirstImage"]?.[0] || null;
        const latestsecondImage = request.files?.["latestSecondImage"]?.[0] || null;

        if (!latestNewsHeading || !latestFirstParagraph || !latestSecondParagraph) {
            return response.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (!latestfirstImage || !latestsecondImage) {
            return response.status(400).json({
                success: false,
                message: "Both images are required",
            });
        }

        // Convert images to Base64 format
        const firstImageBase64 = `data:${latestfirstImage.mimetype};base64,${latestfirstImage.buffer.toString("base64")}`;
        const secondImageBase64 = `data:${latestsecondImage.mimetype};base64,${latestsecondImage.buffer.toString("base64")}`;

        // Save data to MongoDB
        const newsData = new latestModel({
            latestNewsHeading,
            latestFirstParagraph,
            latestSecondParagraph,
            latestfirstImage: firstImageBase64,
            latestsecondImage: secondImageBase64,
        });

        await newsData.save();

        return response.status(201).json({
            success: true,
            message: "News created successfully",
            data: newsData,
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message,
            success: false,
        });
    }
};

export const getLatestnewsDetails = async (request, response) => {
    try {
        const latestdetailsAll = await latestModel.find().sort({ createdAt: -1 });

        return response.status(200).json({
            message: "Latest news retrieved successfully",
            data: latestdetailsAll.length > 0 ? latestdetailsAll : [],
            success: true,
        });
    } catch (error) {
        console.error("Fetch Live Details Error:", error);
        return response.status(500).json({ message: error.message, success: false });
    }
};

export const deleteLatestNews = async (request,response) =>{
    try {
        const {id} = request.params;
        const latestNew = await  latestModel.findById(id);


        if(!latestNew){
            return response.status(400).json({
                message : "Latest post not found",
                success: false
            })
        }

        await latestModel.findByIdAndDelete(id);
        

        return response.status(200).json({
            message: "latest post delete successfully",
            success : true,
        });

    } catch (error) {
        
        return res.status(500).json({ message: error.message, success: false });
      }
}

