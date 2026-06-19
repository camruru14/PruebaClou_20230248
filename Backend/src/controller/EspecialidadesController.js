import { specialtyModel } from "../models/EspecialidadesModel.js"

export const specialtyController = {
    getEspecialidad: async(req, res) => {
        try {
            const specialty = await specialtyModel.find()
            if(!specialty) return res.status(404).json({status:404, message:"Especialidades no encontrados exitosamente", data: null})
             return res.status(200).json({status:200, message:"Especialidades encontrados exitosamente", data: specialty})
        } catch (error) {
            console.log("error  get especialidades: ", error)
            return res.status(500).json({status:200, message:"Error interno del servidor", data:null})
        }
    },
    AddEspecialidad: async(req, res) => {
         try {
            const specialtyReq = req.body
            if(!specialtyReq) return res.status(400).json({status:400, message:"Error al insertar una especialidad", data: null})
            const specialtyInserted = new specialtyModel(specialtyReq)
            specialtyInserted.isAvailable= true
            const specialtySaved = await specialtyInserted.save()
            return res.status(201).json({status:201, message:"Especialidad registrada", data: specialtySaved})
        } catch (error) {
            console.log("error get patients: ", error)
            return res.status(500).json({status:200, message:"Error interno del servidor", data:null})
        }
    },
    UpdateEspecialidad: async(req, res) => {
         try {
            const id = req.params.id
            const specialtyReq = req.body
            if(!specialtyReq) return res.status(400).json({status:400, message:"Error al insertar una especialidad", data: null})
            const specialtyUpdated = await specialtyModel.findByIdAndUpdate(id, specialtyReq, {new: true})
            return res.status(201).json({status:201, message:"Especialidad actualizada ", data: specialtyUpdated})
        } catch (error) {
            console.log("error get patients: ", error)
            return res.status(500).json({status:200, message:"Error interno de el servidor", data:null})
        }
    },
    DeleteEspecialidad: async(req, res) => {
         try {
            const id = req.params.id
            const specialtyDeleted = await specialtyModel.findByIdAndDelete(id)
            return res.status(201).json({status:201, message:"Especialidad eliminada", data: specialtyDeleted})
        } catch (error) {
            console.log("error get patients: ", error)
            return res.status(500).json({status:200, message:"Error interno del servidor", data:null})
        }
    }
}