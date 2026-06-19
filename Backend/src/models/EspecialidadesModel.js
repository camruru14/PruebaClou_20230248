import { model, Schema } from "mongoose";

const especialidadSchema = new Schema({
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

export const specialtyModel = model("especialidad", especialidadSchema)