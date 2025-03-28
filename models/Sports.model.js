import mongoose from "mongoose";

const sportsdetailsSchema = new mongoose.Schema({
    sportName :{
        type : String,
        default : ""
    },
    sportImage : {
        type : String,
        default: ""
    },
    sportDesc : {
        type : String,
        default : ""
    }
},{
    timestamps : true
});

const sportDetailsModel = mongoose.model('Sports',sportsdetailsSchema);

export default sportDetailsModel;
