import mongoose from "mongoose";
import { config } from "./src/config.js";

mongoose.connect(config.db.url);

const connection = mongoose.connection;

connection.once("open", () => {
    console.log("Base de datos conectada");
});

connection.on("disconnected", () => {
    console.log("Base de datos desconectada");
});

connection.on("error", (e) => {
    console.log("Error al conectar a la DB: " + e);
});

export default connection;