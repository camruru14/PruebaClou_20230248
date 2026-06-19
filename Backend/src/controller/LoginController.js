import { pacientesModel } from "../models/PacientesModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { config } from "../config/config.js"

export const LoginPacienteController = {

    login: async(req, res) => {
        try {
            const {email, password} = req.body
            const patient = await pacientesModel.findOne({email})
           
            if(!patient) res.status(404).json({status:400, message:"Paciente no encontrado", data: null})
           
            if(patient.timeOut && patient.timeOut > Date.now()) return res.status(401).json({status:401, message:"error al iniciar", data:null})

            console.log("PacientePassword ", patient.password)
            const isMatch = await bcrypt.compare(password, patient.password || "")
            const patientSave = new pacientesModel(patient)
            if(!isMatch){
                console.log("los datos no coinciden")
                if(patient.loginAttempts >= 5){
                    patientSave.timeOut = Date.now() + 10 * 60 * 1000
                    patientSave.loginAttempts = 0
                }
                await patientSave.save()
                return res.status(401).json({status:401, message:"Credenciales invalidas", data: null})
            }
            patientSave.loginAttempts = 0
            patientSave.timeOut = undefined
            const patientInserted = await patientSave.save()
            const token = jwt.sign(
                {id: patientInserted.id, userType:"Paciente", email: patientInserted.email},
                config.jwt.secret,
                {expiresIn: "30d"}
            )
            res.cookie("AuthCookie", token)
            res.status(200).json({status:200, message:"Inicio de sesion exitoso", data:patientInserted})
        } catch (error) {
            console.log("error login pacientes: ", error)
            return res.status(500).json({status:500, message:"Error interno del servidor", data:null})
        }
    },

    logOut: async(req, res) => {
        try {
         res.clearCookie("AuthCookie")
         return res.status(200).json({status:200, message: "Sesion cerrada", data: null})
        } catch (error) {
            console.log("error login pacientes: ", error)
            return res.status(500).json({status:200, message:"Error interno del servidor", data:null})
        }
    }
}