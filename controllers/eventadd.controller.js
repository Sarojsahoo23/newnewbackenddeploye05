import { request, response } from "express";
import multer from "multer";
import createEventModel from "../models/eventadd.model.js";


const storage = multer.memoryStorage();
const upload = multer({ storage });
export const createEventDetails = async (request,response) =>{
    try {
        
        const {eventName,eventLink,eventDate,eventLocation,eventCoupon} = request.body

        const eventImage = request.files?.["eventImage"]?.[0] || null;

        if(!eventName,!eventLink,!eventDate,!eventLocation,!eventCoupon){
            return response.status(400).json({
                succrequess: false,
                message: "All fields are required",
            })
        }
       
        if(!eventImage) {
            return response.status(400).json({
                success: false,
                message : "Image required"
            })
        }

        const eventImagebase64 = `data:${eventImage.mimetype};base64,${eventImage.buffer.toString("base64")}`;
        const eventData= new createEventModel({
            eventName,eventLink,eventDate,eventLocation,eventCoupon,
            eventImage : eventImagebase64
        });

        await eventData.save();
        return response.status(201).json({
            success: true,
            message: "Event Details created successfully",
            data: eventData,
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message,
            success: false,
        })
    }
}

export const getEventDetails = async (request,response)=>{

     try {
        const eventDetailsAll = await createEventModel.find().sort({createdAt: -1});
        return response.status(200).json({
            message: "Latest event details get successfully",
            data : eventDetailsAll.length > 0 ? eventDetailsAll: [],
            success : true,
        })
     } catch (error) {
        return response.status(500).json({
            message :"Event details fetch successfully",
            error : true,
            success : false
        })
     }
}

export const deleteEventdetails = async (req, res) => {
    try {
        const { id } = req.params;
        const eventNew = await createEventModel.findById(id);

        if (!eventNew) {
            return res.status(404).json({
                message: "Event post not found",
                success: false
            });
        }

        await createEventModel.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Event post deleted successfully",
            success: true
        });

    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};
