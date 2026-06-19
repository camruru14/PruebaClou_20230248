import { patientModel } from "../models/patientModel.js";
import { v2 } from "cloudinary";
import bcrypt from "bcrypt";
 
export const updatePatient = async (req, res) => {
    try {
        const id = req.params.id;
        const updReq = JSON.parse(req.body.data);
        console.log("Update form data ", updReq);
        
        const patientFound = await patientModel.findById(id);
        if (!patientFound) return res.status(404).json({ status: 404, message: "Paciente no encontrado", data: null });
 
        if (updReq.password) {
            updReq.password = await bcrypt.hash(updReq.password, 10);
        }
        
        if (req.file) {
            console.log("patient photoPublic on update ", patientFound.photoPublicId);
            if (patientFound.photoPublicId) {
                await v2.uploader.destroy(patientFound.photoPublicId);
            }
            updReq.photo = req.file.path;
            updReq.photoPublicId = req.file.filename;
        }
        
        const updatedPatient = await patientModel.findByIdAndUpdate(id, updReq, { new: true });
        return res.status(200).json({ status: 200, message: "Paciente actualizado exitosamente", data: updatedPatient });
    } catch (error) {
        console.log("error en updatePatient: ", error);
        return res.status(500).json({ status: 500, message: "Error interno del servidor - revisar server logs", data: null });
    }
};