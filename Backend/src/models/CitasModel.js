import mongoose, { model, Schema } from "mongoose";

const medicalAppointmentSchema = new Schema({
    patient_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "pacientes"
    },
    specialty_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "especialidad"
    },
    appointmentDate:{
        type: String
    },
    reason:{
        type: String
    },
    status:{
        type: String
    },
    observations:{
        type: String
    }
}, {timestamps: true})

export const medicalAppointmentsModel = model("CitasModel", CitasModelSchema)