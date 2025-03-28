import mongoose from "mongoose";

const latestNewsSchema = new mongoose.Schema({
    latestNewsHeading :
     {
        type:String,
        default :""
    },
    latestfirstImage :{
        type:String,
        default :""
    },
    latestFirstParagraph :{
        type:String,
        default :""
    },
  
    latestsecondImage:{
        type:String,
         default :""
    },
    latestSecondParagraph :{
        type:String,
         default :""
    }

},{
    timestamps: true
});


const latestModel = mongoose.model("Latest-News ",latestNewsSchema);

export default latestModel;