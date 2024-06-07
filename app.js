require("dotenv").config();

const express = require("express"),
  mongoose = require("mongoose"),
  app = express(),
  tokenBD = process.env.token,
  path = require("path"),
  foodRouter = require("./controllers/comidas"),
  mesaRouter = require("./controllers/mesas"),
  userRouter = require("./controllers/usuarios");

async function conectarDB() {
  try {
    await mongoose.connect(tokenBD);
    console.log("Conectado a la base de datos");
  } catch (error) {
    console.log(error);
  }
}

conectarDB();
app.use(express.json());

//rutas frontend
app.use("/", express.static(path.resolve("views", "login")));

app.use("/pedidos", express.static(path.resolve("views", "pedidos")));

app.use("/admin/panel", express.static(path.resolve("views", "adminPanel")));

//rutas backend
app.use("/controllers", express.static(path.resolve("controllers")));
app.use("/api/foods", foodRouter);
app.use("/api/mesa", mesaRouter);
app.use("/api/users", userRouter);
module.exports = app;
