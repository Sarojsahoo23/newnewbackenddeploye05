import mongoose from "mongoose";

const occussionSchema = new mongoose.Schema({
    occusionName :{
        type : String,
        default: ""
    },
    occsionHostName :{
       type : String,
        default: ""
    },
    occsionImage :{
        type :String,
        default:""
    },
    occsionDesc :{
        type: String,
        default:""
    }
},{
    timestamps:true
})

const occsuionModel = mongoose.model("Occussion",occussionSchema)

export default occsuionModel;