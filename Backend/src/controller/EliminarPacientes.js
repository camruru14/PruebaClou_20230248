import { patientModel } from "../models/patientModel.js";
import { v2 } from "cloudinary";
 
export const deletePatient = async (req, res) => {
    try {
        const id = req.params.id;
        const patientFound = await patientModel.findById(id);
        if (!patientFound) return res.status(404).json({ status: 404, message: "Paciente no encontrado", data: null });
        
        if (patientFound.photoPublicId) {
            await v2.uploader.destroy(patientFound.photoPublicId);
        }
        console.log("patient image ", patientFound.photoPublicId);
        
        const deletedPatient = await patientModel.findByIdAndDelete(id);
        return res.status(204).json({ status: 204, message: "Paciente eliminado exitosamente", data: deletedPatient });
    } catch (error) {
        console.log("error en deletePatient: ", error);
        return res.status(500).json({ status: 500, message: "Error interno del servidor - revisar server logs", data: null });
    }
};
 