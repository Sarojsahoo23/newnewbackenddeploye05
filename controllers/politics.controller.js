import { request, response } from "express";
import politicsDetailsModel from "../models/politics.model.js";

export const createPolitices = async (request, response) => {
    try {
         const { politicsName, politicsDesc } = request.body;
         const politicsImage = request.files?.politicsImage?.[0] || null;
 
         if (!politicsName || !politicsDesc) {
             return response.status(400).json({
                 success: false,
                 message: "All fields are required",
             });
         }
 
         if (!politicsImage) {
             return response.status(400).json({
                 success: false,
                 message: "Image is required",
             });
         }
 
         const firstImageBase64 = `data:${politicsImage.mimetype};base64,${politicsImage.buffer.toString("base64")}`;
 
         const politicsData = new politicsDetailsModel({
             politicsName,
             politicsDesc,
             politicsImage: firstImageBase64,
         });
 
         await politicsData.save();
 
         return response.status(201).json({
             success: true,
             message: "Politics data created successfully",
             data: politicsData,
         });
     } catch (error) {
         return response.status(500).json({
             success: false,
             message: error.message,
         });
     }
 };
 


export const getPoliticsDetails  = async (request,response) =>{
    try {
        const politicsDetailsAll = await politicsDetailsModel.find().sort({createdAt: -1})
        return response.status(200).json({
            message: "Latest Politics retrieved successfully",
            data: politicsDetailsAll.length > 0 ? politicsDetailsAll : [],
            success: true,
        });
    } catch (error) {
        console.error("Fetch Live Details Error:", error);
        return response.status(500).json({ message: error.message, success: false });
    }
}



export const deletePoliticsDetails = async (request, response) => {
    try {
      const { id } = request.params; // Corrected from request.param to request.params
      const politicsNew = await politicsDetailsModel.findById(id);
  
      if (!politicsNew) {
        return response.status(400).json({
          message: "Politics post not found",
          success: false,
        });
      }
  
      await politicsDetailsModel.findByIdAndDelete(id);
  
      return response.status(200).json({
        message: "Latest post deleted successfully",
        success: true,
      });
    } catch (error) {
      return response.status(500).json({ message: error.message, success: false }); // Fixed response object
    }
  };