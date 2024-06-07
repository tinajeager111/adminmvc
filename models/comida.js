const mongoose = require("mongoose");
const foodRouter = require("../controllers/comidas");

const food = new mongoose.Schema({
  nombre: String,
  precio: Number,
  id: Number,
  categoria: Number,
});

//respuesta del usuario en el esquema

//registrar el modelo

const comida = mongoose.model("Food", food);

//exportar

module.exports = comida;
