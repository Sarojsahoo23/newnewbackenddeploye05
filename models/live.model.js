import mongoose from "mongoose";

const liveDetailsSchema = new mongoose.Schema(
  {
    liveheading: { type: String, default: "" },
    livefirstImage: { type: String, default: "" }, // Cloudinary Image URL
    livefirstParagraph: { type: String, default: "" },
    liveSecondImage: { type: String, default: "" }, // Cloudinary Image URL
    liveSecondParagraph: { type: String, default: "" },
  },
  { timestamps: true }
);

const liveModel = mongoose.model("Live", liveDetailsSchema);
console.log(liveModel);
export default liveModel;
