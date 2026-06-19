import { pacientesModel } from "../models/PacientesModel.js"
import {v2} from "cloudinary"
import bcrypt from "bcrypt"
import { upload } from "../../../config/cloudinaryConfig.js"

export const patientController = {
    getPatients: async(req, res) => {
        try {
            const patients = await pacientesModel.find()
            if(!patients) return res.status(404).json({status:404, message:"Pacientes no encontrados exitosamente", data: null})
            return res.status(200).json({status:200, message:"Pacientes encontrados exitosamente", data: patients})
        } catch (error) {
            console.log("error en get patients: ", error)
            return res.status(500).json({status:200, message:"Error interno del servidor - revisar server logs", data:null})
        }
    },
    updatePatient: async(req, res) => {
        try {
            const id = req.params.id
            const updReq = JSON.parse(req.body.data)
            console.log("Update form data ", updReq)
            const patientFound = await pacientesModel.findById(id)
            if(!patientFound) return res.status(404).json({status:404, message:"Paciente no encontrado", data: null})
        
            if(updReq.password){
                 updReq.password = await bcrypt.hash(updReq.password, 10);
            }
            if(req.file) {
                console.log("patient photoPublic on update ", patientFound.photoPublicId)
                await v2.uploader.destroy(patientFound.photoPublicId)
                updReq.photo = req.file.path,
                updReq.photoPublicId = req.file.filename 
            }
            const updatedPatient = await pacientesModel.findByIdAndUpdate(id, updReq , {new:true})
            return res.status(200).json({status:200, message:"Paciente actualizado exitosamente", data: updatedPatient})
        } catch (error) {
            console.log("error en get updatePatient: ", error)
            return res.status(500).json({status:200, message:"Error interno del servidor - revisar server logs", data:null})
        }
    },
    deletePatient: async(req, res) => {
        try {
            const id = req.params.id
            const patientFound = await pacientesModel.findById(id)
            if(!patientFound) return res.status(404).json({status:404, message:"Paciente no encontrado", data: null})
            if(patientFound.photoPublicId){
                await v2.uploader.destroy(patientFound.photoPublicId)
            }
            console.log("patient image ", patientFound.photoPublicId)
            const deletedPatient = await pacientesModel.findByIdAndDelete(id)
            return res.status(204).json({status:204, message:"Paciente eliminado exitosamente", data: deletedPatient})
        } catch (error) {
            console.log("error en get patients: ", error)
            return res.status(500).json({status:200, message:"Error interno del servidor - revisar server logs", data:null})
        }
    }
}