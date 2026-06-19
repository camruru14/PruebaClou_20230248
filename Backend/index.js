import app from "./app.js";
import "./database.js"
import { config } from "./src/config.js";


import { getPatients } from "./getPatients.js";
import { updatePatient } from "./updatePatient.js";
import { deletePatient } from "./deletePatient.js";
 
export const patientController = {
    getPatients,
    updatePatient,
    deletePatient
};

async function main() {
    app.listen(config.server.port)
}

main();