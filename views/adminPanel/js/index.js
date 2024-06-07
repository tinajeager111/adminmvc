import { consultarBD, agregarBD, editarBD, eliminardelaBD } from "./api.js";

const containerList = document.querySelector("#listado-Productos");
const logoutBtn = document.querySelector("#logout");

logoutBtn.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("user");
  window.location.href = "/";
});

document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("user"));
  if (!usuario) {
    window.location.href = "/";
  }
  if (usuario.rol === 2) {
    window.location.href = "/pedidos";
  }
  mostrarProductos();
});
containerList.addEventListener("click", deleteProduct);

async function deleteProduct(e) {
  if (e.target.classList.contains("eliminar")) {
    const id = parseInt(e.target.getAttribute("data-producto"));
    const confirmar = confirm("¿Quieres eliminar este producto?");
    if (confirmar){
      await eliminardelaBD(id);
      window.location.href = "/admin/panel";
    }
  }
}

async function mostrarProductos() {
  const listadoProductos = await consultarBD();
  if (listadoProductos === 404) {
    return alert("Hubo un error al traer los productos");
  }
  listadoProductos.forEach((product) => {
    const { id, nombre, precio, categoria } = product;

    const row = document.createElement("tr");

    row.innerHTML = `
        <td class='px-5 py-4 border-b border-gray-200'>
            <p class='font-bold'>${nombre}</p>
        </td>
        <td class='px-5 py-4 border-b border-gray-200'>
            <p class=''>${precio}</p>
        </td> 
        <td class='px-5 py-4 border-b border-gray-200'>
            <p class=''>${categoria}</p>
        </td>
        <td class='px-5 py-4 border-b border-gray-200'>
            <a href='editar-producto.html?id=${id}' class='text-teal-600 hover:text-teal-900 px-3'>Editar</a>
            <a href='#' data-producto='${id}' class='eliminar text-red-600 hover:text-red-900 px-3'>Eliminar</a>
        </td>
        `;
    row.classList.add("py-3");
    containerList.appendChild(row);
  });
}
