import mongoose from "mongoose";

const comicSchema = new mongoose.Schema({
   comicHeading :
     {
        type:String,
        default :""
    },
    comicFirstImage :{
        type:String,
        default :""
    },
    comicFirstParagraph :{
        type:String,
        default :""
    },
  
    comicSecondImage:{
        type:String,
         default :""
    },
    comicSecondParagraph :{
        type:String,
         default :""
    }

},{
    timestamps: true
});


const comicModel = mongoose.model("Comics",comicSchema);

export default comicModel;