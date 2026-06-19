import { patientModel } from "../models/patientModel.js";
 
export const getPatients = async (req, res) => {
    try {
        const patients = await patientModel.find();
        if (!patients) return res.status(404).json({ status: 404, message: "Pacientes no encontrados exitosamente", data: null });
        
        return res.status(200).json({ status: 200, message: "Pacientes encontrados exitosamente", data: patients });
    } catch (error) {
        console.log("error en get patients: ", error);
        return res.status(500).json({ status: 500, message: "Error interno del servidor - revisar server logs", data: null });
    }
};