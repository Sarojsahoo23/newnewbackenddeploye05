import { request, response } from "express";
import sportDetailsModel from "../models/Sports.model.js";

export  const createSportDetails = async (request,response) =>{
    
    try {
        const {sportName,sportDesc} = request.body
        const sportImage = request.files?.["sportImage"]?.[0] || null;

        if(!sportName,!sportDesc){
            return response.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        if(!sportImage){
            return response.status(400).json({
                success: false,
                message: "Both images are required",
            });
        }
        const firstImageBase64 = `data:${sportImage.mimetype};base64,${sportImage.buffer.toString("base64")}`;
   const sportData = new sportDetailsModel({
    sportName,sportDesc,sportImage:firstImageBase64
   })
await sportData.save();
return response.status(201).json({
    success: true,
    message: "Sport data created successfully",
    data: sportData,
});

    } catch (error) {
        return res.status(500).json({
            message :error.message,
            success: false
        })
    }




}

export const getSportDetails  = async (request,response) =>{
try {
    const sportDetailsAll = await sportDetailsModel.find().sort({createdAt: -1})
    return response.status(200).json({
        message: "Latest news retrieved successfully",
        data: sportDetailsAll.length > 0 ? sportDetailsAll : [],
        success: true,
    });
} catch (error) {
    console.error("Fetch Live Details Error:", error);
    return response.status(500).json({ message: error.message, success: false });
}
}
export const deleteSportDetails = async (request, response) => {
    try {
      const { id } = request.params; // Corrected from request.param to request.params
      const sportNew = await sportDetailsModel.findById(id);
  
      if (!sportNew) {
        return response.status(400).json({
          message: "Sports post not found",
          success: false,
        });
      }
  
      await sportDetailsModel.findByIdAndDelete(id);
  
      return response.status(200).json({
        message: "Latest post deleted successfully",
        success: true,
      });
    } catch (error) {
      return response.status(500).json({ message: error.message, success: false }); // Fixed response object
    }
  };
  