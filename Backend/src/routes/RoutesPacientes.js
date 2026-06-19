import express from "express"
import { patientController } from "../controller/controllerPatients.js"
import { upload } from "../../../config/cloudinaryConfig.js"
import { registerPatientController } from "../controller/registerPatient.js"
import { loginPatientController } from "../controller/loginPatients.js"
import { recoveryPatientPasswordController } from "../controller/recoveryPatientPassword.js"

export const patientRouter = express.Router()

patientRouter.route("/")
.get(patientController.getPatients)
.post(upload.single("image"), registerPatientController.addPatient)

patientRouter.route("/:id").delete(patientController.deletePatient).put(upload.single("image"), patientController.updatePatient)

patientRouter.route("/verifyCode").post(registerPatientController.verifyCode)

patientRouter.route("/login").post(loginPatientController.login)

patientRouter.route("/logOut").post(loginPatientController.logOut)


patientRouter.route("/recoveryCode").post(recoveryPatientPasswordController.recoveryCode)

patientRouter.route("/verifyRecoveryCode").post(recoveryPatientPasswordController.verifyRecoveryCode)

patientRouter.route("/newPassword").post(recoveryPatientPasswordController.newPassword)