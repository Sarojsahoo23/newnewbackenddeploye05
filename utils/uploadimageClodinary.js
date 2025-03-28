import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLODINARY_CLOUD_NAME,
  api_key: process.env.CLODINARY_API_KEY,
  api_secret: process.env.CLODINARY_API_SECRET_KEY,
});

const uploadImageCloudinary = async (image) => {
  try {
    if (!image) return "";

    const buffer = image.buffer || Buffer.from(await image.arrayBuffer());

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "binkeyit" }, (error, uploadResult) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            reject(error);
          } else {
            resolve(uploadResult.secure_url); // Return image URL
          }
        })
        .end(buffer);
    });
  } catch (error) {
    console.error("Cloudinary Upload Failed:", error);
    return "";
  }
};

export default uploadImageCloudinary;
