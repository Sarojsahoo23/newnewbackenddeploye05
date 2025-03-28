import requestPostModel from "../models/requestPost.model.js";
import sendEmail from "../config/sendEmail.js"; // Import sendEmail function
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage });
export const createRequestPost = async (req, res) => {
    try {
        const { requestPostHeading, requestPostName, requestPostNumber, requestPostDate, requestPostDesc } = req.body;
        const requestPostImage = req.file;

        // Check required fields
        if (!requestPostHeading || !requestPostName  || !requestPostDate || !requestPostDesc) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if (!requestPostImage) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }

        // Convert image to base64
        const requestImageBase64 = `data:${requestPostImage.mimetype};base64,${requestPostImage.buffer.toString("base64")}`;

        // Parse date correctly
       // Extract day, month, year from DD-MM-YYYY
const [day, month, year] = requestPostDate.split("-");

// Convert to YYYY-MM-DD format for correct parsing
const formattedDate = `${year}-${month}-${day}`;

const parsedDate = new Date(formattedDate);

// Validate date
if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({ success: false, message: "Invalid date format" });
}


        // Create request data
        const requestData = new requestPostModel({
            requestPostHeading,
            requestPostName,
            requestPostNumber,
            requestPostDesc,
            requestPostDate: parsedDate,
            requestPostImage: requestImageBase64
        });

        // Save to DB
        await requestData.save();

        // Send email notification to admin
        const emailSubject = "New Request Post Received get live as soon as possible";
        const emailHtml = `
            <h3>New Request Post Submitted</h3>
            <p><strong>Heading:</strong> ${requestPostHeading}</p>
            <p><strong>Name:</strong> ${requestPostName}</p>
            <p><strong>Number:</strong> ${requestPostNumber}</p>
            <p><strong>Date:</strong> ${parsedDate.toDateString()}</p>
            <p><strong>Description:</strong> ${requestPostDesc}</p>
            <p><img src="${requestImageBase64}" alt="Request Image" width="300"/></p>
        `;

        await sendEmail({
            sendTo: "sahoosaroj2001@gmail.com",
            subject: emailSubject,
            html: emailHtml
        });

        return res.status(201).json({ success: true, message: "Your  event request has been recorded successfully! We’ll get back to you soon with updates", data: requestData });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getRequestPost = async (req,res)=>{
    try {

        const requestDetailsAll = await requestPostModel.find().sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Requested data retrieved successfully",
            data: requestDetailsAll.length > 0 ? requestDetailsAll : [],
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Requested  details could not be fetched",
            error: error.message,  
            success: false
        });
    }
}

export const deleterequestlDetails = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete and check if the post exists in one step
        const deletedRequest = await requestPostModel.findByIdAndDelete(id);

        if (!deletedRequest) {
            return res.status(404).json({
                message: "Request   post not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Request post deleted successfully",
            success: true
        });

    } catch (error) {
        return res.status(500).json({ 
            message: error.message, 
            success: false 
        });
    }
};