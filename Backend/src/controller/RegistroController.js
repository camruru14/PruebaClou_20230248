import { patientModel } from "../models/patientModel.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { config } from "../../../config/config.js";

export const registerPatientController = {
  addPatient: async (req, res) => {
    try {
      const patientReq = JSON.parse(req.body.data);
      console.log("patient from data ", patientReq)
      console.log("form data password ", patientReq.password)
      if (!patientReq)
        return res
          .status(400)
          .json({ status: 400, message: "Bad request patient", data: null });
      const existPatient = await patientModel.findOne({
        email: patientReq.email,
      });
      if (existPatient)
        return res.statu(400).json({
          status: 400,
          message: "Paciente ya registrado",
          data: null,
        });
      const email = patientReq.email;
      const passwordHashed = await bcrypt.hash(patientReq.password, 10);
      const verificationCode = await crypto.randomBytes(3).toString("Hex");
      const tokenCode = jwt.sign(
        { email, verificationCode },
        config.jwt.secret,
        { expiresIn: "15m" },
      );
      res.cookie("VerificationToken", tokenCode, { maxAge: 15 * 60 * 1000 });
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
      const insert_patient = new patientModel(patientReq);
      insert_patient.password = passwordHashed;
      insert_patient.isVerified = false;
      if (req.file) {
        insert_patient.photo = req.file.path;
        insert_patient.photoPublicId = req.file.filename;
      }
      const savedPatient = await insert_patient.save();
      return res
        .status(201)
        .json({
          status: 201,
          message: "Paciente registrado exitosamente",
          data: savedPatient,
        });
    } catch (error) {
      console.log("error en add patients: ", error);
      return res.status(500).json({
        status: 200,
        message: "Error interno del servidor - revisar server logs",
        data: null,
      });
    }
  },
  verifyCode: async(req, res) => {
    try {
        const {verifyCodeRequest} = req.body
        const token = req.cookies.VerificationToken
        const decoded = jwt.verify(token, config.jwt.secret)
        const customDecoded = decoded
        console.log("CustomDecoded ", customDecoded)
        console.log(".verificationCode ", customDecoded.verificationCode)
        if(verifyCodeRequest !== customDecoded.verificationCode) return res.status(400).json({status: 400, message:"Error el codigo de verificacion es invalido", data: null})
        const patient = await patientModel.findOne({email: customDecoded.email})
        patient.isVerified = true
        await patient.save()
        res.clearCookie("VerificationToken")
        return res.status(200).json({status:200, message: "Usuario verificado exitosamente", data: null})
    } catch (error) {
      console.log("error en verify patients: ", error);
      return res.status(500).json({
        status: 500,
        message: "Error interno del servidor - revisar server logs",
        data: null,
      });
    }
  }
};