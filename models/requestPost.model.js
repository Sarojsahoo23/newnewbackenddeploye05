import mongoose from "mongoose";

const requestPostSchema = new mongoose.Schema({
    requestPostHeading: {
        type: String,
        default: "",
    },
    requestPostName: {
        type: String,
        default: "",
    },
    requestPostNumber: {
        type: String,
        default: "",
    },
    requestPostImage: {
        type: String,
        default: "",
    },
    requestPostDate: {
        type: Date,
        default: Date.now, 
    },
    requestPostDesc: {
        type: String,
        default: "",
    },
},{
    timestamps:true
});

const requestDateModel = mongoose.model('Request Post',requestPostSchema)
export default requestDateModel;

