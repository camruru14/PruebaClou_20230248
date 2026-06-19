import e from "express";
import citasMedicasRouter from "./src/routes/citasMedicasRoute.js";
import equipoMedicoRouter from "./src/routes/equipoMedicoRoute.js";
import especialidadesMedicasRouter from "./src/routes/especialidadesMedicasRoute.js";
import expedienteClinicoRouter from "./src/routes/expedienteClinicoRoute.js";
import loginPacientesRouter from "./src/routes/loginPacientesRoute.js";
import pacientesRouter from "./src/routes/pacientesRoute.js";
import recoveryPasswordRouter from "./src/routes/recoveryPasswordRoute.js";
import registerPacientesRouter from "./src/routes/registerPacientesRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = e();

app.use(cors({
    credentials: true
}))

app.use(cookieParser());

app.use(e.json());

//Endpoints
app.use("/api/citasMedicas", citasMedicasRouter);
app.use("/api/equipoMedico", equipoMedicoRouter);
app.use("/api/especialidadesMedicas", especialidadesMedicasRouter);
app.use("/api/expedienteClinico", expedienteClinicoRouter);
app.use("/api/loginPacientes", loginPacientesRouter);
app.use("/api/pacientes", pacientesRouter);
app.use("/api/registerPacientes", registerPacientesRouter);
app.use("/api/recoveryPassword", recoveryPasswordRouter);

export default app;