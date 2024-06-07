const mesaRouter = require("express").Router();
const mesa = require("../models/mesa");

mesaRouter.get("/", (req, res) => {
  const { usuario } = req.query;

  async function consultarBD() {
    const consulta = await mesa.findOne({ usuario: usuario });
    res.status(202).json(consulta);
  }
  consultarBD().catch(console.error);
});

mesaRouter.post("/", (request, response) => {
  const { numMesa, hora, pedido, usuario } = request.body;

  const mesas = new mesa();

  mesas.numMesa = numMesa;
  mesas.Hora = hora;
  mesas.pedido = pedido;
  mesas.usuario = usuario;

  async function guardarBD() {
    await mesas.save();
  }
  guardarBD().catch(console.error);
  response.status(200).json({ mensaje: "Se ha guardado con éxito" });
});

module.exports = mesaRouter;
