import { editarBD, consultaIDBD } from "./api.js";

const inputNombre = document.querySelector("#nombre");
const inputCat = document.querySelector("#categoria");
const inputPrecio = document.querySelector("#precio");
const formulario = document.querySelector("#formulario");
const URL = new URLSearchParams(window.location.search);
const id = parseInt(URL.get("id"));

document.addEventListener("DOMContentLoaded", async () => {
  const consulta = await consultaIDBD(id);
  mostrarProducto(consulta);
});

function mostrarProducto(producto) {
  const { categoria, nombre, precio } = producto;
  inputNombre.value = nombre;
  inputCat.value = categoria;
  inputPrecio.value = precio;
}

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();
  const listadoInputs = [
    inputCat.value,
    inputNombre.value,
    inputPrecio.value,
  ].some((i) => i === "");
  if (listadoInputs) {
    alert("Todos los campos son obligatorios");
    return;
  }

  const nombre = inputNombre.value,
    categoria = inputCat.value,
    precio = inputPrecio.value,
    confirmar = confirm("Esta seguro de los cambio?");
  if (confirmar) {
    window.location.href = "/admin/panel";
    await editarBD({
      nombre: nombre,
      id: id,
      categoria: categoria,
      precio: precio,
    });
  }
});
