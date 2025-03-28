import mongoose from "mongoose";

const promotionalSchema = new mongoose.Schema({
    promoName: {
        type: String,
        default: ""
    },
    promoImage : {
       type: String,
        default: ""
    },
    promoDate: {
        type: Date, 
        default: () => new Date() 
    },
    promoLink: {
        type: String,
        default: ""
    }
},{
    timestamps : true
});

const promoModel = mongoose.model("Promotional", promotionalSchema);
export default promoModel;
