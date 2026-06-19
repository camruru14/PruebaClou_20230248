import { model, Schema } from "mongoose";

const specialtySchema = new Schema({
    specialtyname:{
        type:String
    },
    description:{
        type: String
    },
    isAvailable:{
        type: Boolean
    }
})

export const specialtyModel = model("specialty", specialtySchema)