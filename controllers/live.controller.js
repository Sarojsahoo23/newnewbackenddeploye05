import liveModel from "../models/live.model.js";
import uploadImageCloudinary from "../utils/uploadimageClodinary.js";

// Create Live Post (Upload Images to Cloudinary)
export const createLive = async (request, response) => {
  try {
    const { liveheading, livefirstParagraph, liveSecondParagraph } = request.body;

    // Ensure `request.files` exists before accessing
    const livefirstImage = request.files?.["livefirstImage"]
      ? await uploadImageCloudinary(request.files["livefirstImage"][0])
      : "";

    const liveSecondImage = request.files?.["liveSecondImage"]
      ? await uploadImageCloudinary(request.files["liveSecondImage"][0])
      : "";
      if (!livefirstImage || !liveSecondImage) {
        return response.status(400).json({
            success: false,
            message: "Both images are required",
        });
    }
    // Save in MongoDB
    const live = new liveModel({
      liveheading,
      livefirstImage,
      livefirstParagraph,
      liveSecondImage,
      liveSecondParagraph,
    });

    await live.save();

    return response.status(201).json({
      message: "Live post created successfully",
      success: true,
      data: live,
    });
  } catch (error) {
    console.error("Create Live Error:", error);
    return response.status(500).json({ message: error.message, success: false });
  }
};

// Get All Live Posts
export const getLiveDetails = async (req, res) => {
  try {
    const liveDetailsAll = await liveModel.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Live details fetched successfully",
      data: liveDetailsAll.length > 0 ? liveDetailsAll : [],
      success: true,
    });
  } catch (error) {
    console.error("Fetch Live Details Error:", error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

// Delete a Live Post by ID
export const deleteLivePost = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the post exists
    const livePost = await liveModel.findById(id);
    if (!livePost) {
      return res.status(404).json({ message: "Live post not found", success: false });
    }

    // Delete from MongoDB
    await liveModel.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Live post deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Delete Live Post Error:", error);
    return res.status(500).json({ message: error.message, success: false });
  }
};
