const mongoose = require("mongoose");
const mesaRouter = require("../controllers/mesas");

const mesa = new mongoose.Schema({
  numMesa: Number,
  Hora: String,
  pedido: String,
  usuario: String,
});

//respuesta del usuario en el esquema

mesa.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

//registrar el modelo

const pedido = mongoose.model("Mesa", mesa);

//exportar

module.exports = pedido;
