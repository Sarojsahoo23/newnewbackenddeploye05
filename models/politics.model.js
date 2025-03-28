import mongoose from "mongoose";

const politicsdetailsSchema = new mongoose.Schema({
    politicsName :{
        type : String,
        default : ""
    },
    politicsImage : {
        type : String,
        default: ""
    },
    politicsDesc : {
        type : String,
        default : ""
    }
},{
    timestamps : true
});

const politicsDetailsModel = mongoose.model('Politics',politicsdetailsSchema);

export default politicsDetailsModel;