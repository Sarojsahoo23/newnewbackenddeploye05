
import { request, response } from "express";
import occsuionModel from "../models/occasion.model.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const createOccsion = async (request,response)=>{

      try {
        const {occusionName,occsionHostName,occsionDesc} = request.body
        const occsionImage = request.files?.["occsionImage"]?.[0] || null;
       if(!occusionName,!occsionHostName,!occsionDesc) {
        return response.status(400).json({
            success: false,
            message: "All fields are required",
        })
       }

       if(!occsionImage) {
        return response.status(400).json({
            success: false,
            message : "Image required"
        })
    }
    const occsionImagebase64 = `data:${occsionImage.mimetype};base64,${occsionImage.buffer.toString("base64")}`;


    const occsionData = new occsuionModel({
        occusionName,occsionHostName,occsionDesc,occsionImage:occsionImagebase64
    })
   await occsionData.save()

   return response.status(201).json({
    success: true,
    message: "Occsion Details created successfully",
    data: occsionData,
});
      } catch (error) {
        return response.status(500).json({
            message: error.message,
            success: false,
        })
    }
}


export const getOccsionDetails = async(request,response)=>{
    try {
        const occusionDetailsAll = await occsuionModel.find().sort({createdAt : -1})
        return response.status(200).json({
            message: "Occusion  details get successfully",
            data : occusionDetailsAll.length > 0 ? occusionDetailsAll: [],
            success : true,
        })
    } catch (error) {
        return response.status(500).json({
            message :"Occsuion  details not fetch successfully",
            error : true,
            success : false
        })
    }
}

export const deleteOccsionData = async(request,response)=>{
    try {
        const {id} = request.params;
      
        const occusionNew = await occsuionModel.findById(id);
        if(!occusionNew){
            return response.status(404).json({
                message: "Event post not found",
                success: false
            });
        }
      await occsuionModel.findByIdAndDelete(id);
      return response.status(200).json({
        message: "Occsion  post deleted successfully",
        success: true
    });

} catch (error) {
    return response.status(500).json({ message: error.message, success: false });
}
};