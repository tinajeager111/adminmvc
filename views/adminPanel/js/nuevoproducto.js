import { agregarBD, consultarBD } from "./api.js";

const formulario = document.querySelector("#formulario");

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();
  const cantidadProductos = await consultarBD();
  const inputNombre = document.querySelector("#nombre").value,
    inputPrecio = document.querySelector("#precio").value,
    inputCat = document.querySelector("#categoria").value;
  const listadoInputs = [inputCat, inputNombre, inputPrecio].some(
    (i) => i !== ""
  );
  if (!listadoInputs) {
    return alert("No puede dejar los campos vacios");
  }
  await agregarBD({
    nombre: inputNombre,
    precio: inputPrecio,
    categoria: inputCat,
    id: `${(cantidadProductos.length += 1)}`,
  });

  window.location.href = "/admin/panel";
});
