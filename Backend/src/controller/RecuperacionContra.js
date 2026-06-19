import jwt from "jsonwebtoken"
import crypto from "crypto"
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"
import { config } from "../../../config/config.js";
import { patientModel } from "../models/patientModel.js";

export const recoveryPatientPasswordController = {
    
    recoveryCode: async(req, res) => {
        try {
            const {email} = req.body
            const existPatient = await patientModel.findOne({email: email})
            if(!existPatient) return res.status(404).json({status:404, message:"Paciente no encontrado", data:null})
            const verificationCode = await crypto.randomBytes(3).toString("Hex");
            const tokenCode = jwt.sign(
                    { email, verificationCode },
                    config.jwt.secret,
                    { expiresIn: "15m" },
            );
            res.cookie("VerificationRecoveryToken", tokenCode, { maxAge: 15 * 60 * 1000 });
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: { user: config.mail.user, pass: config.mail.password },
                 tls: { rejectUnauthorized: false },
             });
            const mailOption = {
                from: config.mail.user,
                to: email,
                subject: verificationCode,
            };
            await transporter.sendMail(mailOption);
            return res.status(200).json({status:200, message:"Codigo de verificacion enviado exitosamente", data:null})
        } catch (error) {
            console.log("error en login recoveryPatientPassword: ", error)
            return res.status(500).json({status:500, message:"Error interno del servidor - revisar server logs", data:null})
        }
    },

    verifyRecoveryCode: async(req, res) => {
        try {
            const {recoveryCodeRequest} = req.body
            const token = req.cookies.VerificationRecoveryToken;
            const decoded = jwt.verify(token, config.jwt.secret)
            const email = decoded.email
            console.log("Decoded de verifyCode", decoded)
            if(decoded.verificationCode !== recoveryCodeRequest) return res.status(400).json({status:400, message:"codigo de verificacion incorrecto", data:null})
            res.clearCookie("VerificationRecoveryToken")
            const tokenCode = jwt.sign(
                    { email, verified:true },
                    config.jwt.secret,
                    { expiresIn: "15m" },
            );
            res.cookie("recoveryCookie", tokenCode, { maxAge: 15 * 60 * 1000 });
            return res.status(200).json({status:200, message:"Codigo de Codigo verificado exitosamente", data:null})
        } catch (error) {
            console.log("error en login recoveryPatientPassword: ", error)
            return res.status(500).json({status:500, message:"Error interno del servidor - revisar server logs", data:null})
        }
    },

    newPassword: async(req, res) => {
        try {
            const {newPassword, confirmNewPassowrd} = req.body
            if(newPassword !== confirmNewPassowrd) return res.status(400).json({status:200, message:"error las contraseñas no coinciden", data: null})
            const token = req.cookies.recoveryCookie;
            const decoded = jwt.verify(token, config.jwt.secret)
            console.log("Decoded de newPassword", decoded)
            if(!decoded.verified) return res.staus(400).json({status:400, message: "error no se encontro ningun codigo", data: null})
            const passwordHashed = await bcrypt.hash(newPassword, 10)
            await patientModel.findOneAndUpdate(
                {email: decoded.email},
                {password: passwordHashed},
                {new: true}
            )
            res.clearCookie("recoveryCookie")
            return res.status(200).json({status:200, message:"Contraseña actualizada exitosamente", data: null})
        } catch (error) {
            console.log("error en login recoveryPatientPassword: ", error)
            return res.status(500).json({status:500, message:"Error interno del servidor - revisar server logs", data:null})
        }
    }
}