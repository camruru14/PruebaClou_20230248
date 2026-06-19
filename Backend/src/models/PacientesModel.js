import { model, Schema } from "mongoose";

const patientSchema =  new Schema({
    name:{
        type: String
    },
    lastName:{
        type: String
    },
    email:{
        type: String
    },
    password:{
        type: String
    },
    phone:{
        type: String
    },
    address:{
        type: String
    },
    phoneEmergency:{
        type: String
    },
    photo:{
        type:String
    },
    photoPublicId:{
        type: String
    },
    isVerified:{
        type: Boolean
    },
    loginAttempts:{
        type: Number
    },
    timeOut:{
        type: String
    }
},{
    timestamps: true
})

export const patientModel = model("patients", patientSchema)