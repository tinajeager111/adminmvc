//1 definir el router
//router: POST, GET, DELETE , REGISTRO, CONSULTAR

const foodRouter = require("express").Router();
const food = require("../models/comida");

// 2 registro de la informacion que el usuario registro

foodRouter.get("/", (request, response) => {
  const { id } = request.query;
  if (id === undefined) {
    try {
      async function consultarComida() {
        const consultarComida = await food.find();
        response.json(consultarComida);
      }
      return consultarComida();
    } catch (error) {
      return response.json({
        message: "No se encontro la comida",
      });
    }
  }
  try {
    async function consultarID() {
      const product = await food.findOne({ id: parseInt(id) });
      response.json(product);
    }
    consultarID();
  } catch (error) {
    console.log(error);
  }
});

foodRouter.post("/", (req, res) => {
  const { id, nombre, precio, categoria } = req.body;
  async function agregar() {
    const newFood = new food();
    newFood.nombre = nombre;
    newFood.precio = precio;
    newFood.categoria = categoria;
    newFood.id = id;
    newFood.save();
    res.json({
      message: "Se agrego la comida",
    });
  }
  agregar().catch(console.error);
});

foodRouter.put("/", (request, response) => {
  const { id, nombre, precio, categoria } = request.body;
  try {
    async function editar() {
      await food
        .findOneAndUpdate(
          { id: id },
          { nombre: nombre, precio: precio, categoria: categoria }
        )
        .then(
          response.json({
            message: "Se actualizo la comida",
          })
        );
    }
    editar();
  } catch (error) {
    console.log(error);
  }
});

foodRouter.delete("/", (req, res) => {
  const { id } = req.query;

  try {
    async function eliminar() {
      await food.findOneAndDelete({ id: parseInt(id) }).then(
        res.json({
          message: "Se elimino la comida",
        })
      );
    }
    eliminar();
  } catch (error) {}
});

module.exports = foodRouter;
