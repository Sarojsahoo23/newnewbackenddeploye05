import mongoose from "mongoose";

const eventAddSchema = new mongoose.Schema({
    eventName: {
        type:String,
        default :""
    },
    eventImage:{
        type:String,
        default:""
    },
    eventLink : {
        type:String,
        default: ""
    },
    eventDate :{
        type:String,
        default :""
    },
    eventLocation :{
        type:String,
        default : ""
    },
    eventCoupon :{
        type : String,
        default:""
    }

},{
    timestamps : true
})

const createEventModel = mongoose.model("Events",eventAddSchema)

export default createEventModel;
