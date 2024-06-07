const btnCrear = document.querySelector("#guardar-cliente");
const container2 = document.querySelector("#resumen .contenido");
const btnSave = document.querySelector("#btn-guardar");
const URL = new URLSearchParams(window.location.search);
const usuario = URL.get("usuario");

//crear estructura para guardar

document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "/";
  }

  try {
    const consulta = await axios.get("/api/mesa", {
      params: {
        usuario: usuario,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

let cliente = {
  mesa: "",
  hora: "",
  pedido: [],
};

const categorias = {
  1: "Comidas",
  2: "Postres",
  3: "Bebidas",
};

btnCrear.addEventListener("click", crearCliente);

function crearCliente() {
  const numMesa = document.querySelector("#mesa").value,
    inputHora = document.querySelector("#hora").value;

  const camposVacios = [inputHora, numMesa].some((i) => i == "");
  if (camposVacios) {
    return mostrarMSGerr("No puede dejar los campos vacios");
  }

  function mostrarMSGerr(msg) {
    const modalErr = document.querySelector(".invalido");

    if (!modalErr) {
      const divError = document.createElement("div");
      divError.classList.add("invalido", "text-center");
      divError.innerHTML = msg;

      setTimeout(() => {
        divError.remove();
      }, 2000);
      document.querySelector(".modal-body form").appendChild(divError);
    }
  }

  cliente.mesa = numMesa;
  cliente.hora = inputHora;

  cliente = { ...cliente, numMesa, inputHora };
  let modalForm = document.querySelector("#formulario");
  var modal = bootstrap.Modal.getInstance(modalForm);
  modal.hide();

  mostrarSec();
  obtenerMenu();
}

btnSave.addEventListener("click", () => {
  guardarBD();
});

async function guardarBD() {
  try {
    if (!cliente.mesa) {
      localStorage.removeItem("user");
      return (window.location.href = "/");
    }
    axios.post("/api/mesa", {
      numMesa: cliente.mesa,
      hora: cliente.hora,
      pedido: JSON.stringify(cliente.pedido),
      usuario: usuario,
    });
    window.location.href = "/";
    localStorage.removeItem("user");
  } catch (error) {
    return alert("No se pudo guardar en la BD");
  }
}

function mostrarSec() {
  let retirandoDN = document.querySelectorAll(".d-none");
  retirandoDN.forEach((i) => i.classList.remove("d-none"));
}

async function obtenerMenu() {
  try {
    const productos = await axios.get("/api/foods");
    mostrarHTML(productos.data);
  } catch (error) {
    alert("Error al traer el menu");
  }
}

function mostrarHTML(menu) {
  let container = document.querySelector("#container");

  menu.forEach((i) => {
    let div = document.createElement("div");
    const { nombre, precio, categoria, id } = i;

    div.classList.add("row", "border-top", "text-center");

    const containerNombre = document.createElement("div");
    containerNombre.classList.add("col-md-4", "py-3");
    containerNombre.textContent = `${nombre}`;

    const containerPrecio = document.createElement("div");
    containerPrecio.classList.add("col-md-2", "py-3");
    containerPrecio.textContent = `$${precio}`;

    const containerCategoria = document.createElement("div");
    containerCategoria.classList.add("col-md-3", "py-3");
    containerCategoria.textContent = `${categorias[categoria]}`;

    const containerCantidad = document.createElement("div");
    const cantidad = document.createElement("input");
    containerCantidad.classList.add("col-md-2", "py-3");
    cantidad.classList.add("form-control");
    cantidad.type = "number";
    cantidad.value = 0;
    cantidad.min = 0;
    cantidad.id = `${id}`;

    containerCantidad.appendChild(cantidad);

    cantidad.onchange = function () {
      const cantidadComida = parseInt(cantidad.value);
      agregarOrden({ ...i, cantidadComida });
    };

    div.appendChild(containerNombre);
    div.appendChild(containerPrecio);
    div.appendChild(containerCategoria);
    div.appendChild(containerCantidad);

    container.appendChild(div);
  });
}

function agregarOrden(objOrden) {
  //console.log(objOrden.id)
  const { pedido } = cliente;
  if (objOrden.cantidadComida > 0) {
    if (pedido.some((i) => i.id === objOrden.id)) {
      const pedidoAct = pedido.map((i) => {
        if (i.id == objOrden.id) {
          i.cantidadComida = objOrden.cantidadComida;
        }
        return i;
      });
      cliente.pedido = [...pedidoAct];
    } else {
      cliente.pedido = [...pedido, objOrden];
    }
    //console.log(cliente.pedido);
  } else {
    const resultado = pedido.filter((i) => i.id !== objOrden.id);
    cliente.pedido = resultado;
    //console.log(cliente.pedido);
  }
  container2.innerHTML = "";
  if (cliente.pedido.length) {
    actualizarResumen();
    actualizarTotal();
  } else {
    container2.innerHTML = `<p class="text-center">Añade los elementos del pedido</p>
`;
  }
}

function actualizarTotal() {
  const textoPropina = document.createElement("h3");
  textoPropina.innerText = "Propina";
  const divTotal = document.createElement("div");
  const divPropina1 = document.createElement("div");
  const divPropina2 = document.createElement("div");
  const containerPropinas = document.createElement("div");
  const label1 = document.createElement("label");
  const label2 = document.createElement("label");
  const propina1 = document.createElement("input");
  propina1.type = "radio";
  propina1.name = "propina";
  const propina2 = document.createElement("input");
  propina2.type = "radio";
  propina2.name = "propina";
  divPropina1.appendChild(propina1);
  divPropina1.appendChild(label1);
  label1.textContent = "Propina 5%";
  label2.textContent = "Propina 10%";
  divPropina2.appendChild(propina2);
  divPropina2.appendChild(label2);
  containerPropinas.appendChild(textoPropina);
  containerPropinas.appendChild(divPropina1);
  containerPropinas.appendChild(divPropina2);

  containerPropinas.classList.add("col-md-4");
  let totalPedido = 0;

  let { pedido } = cliente;

  pedido.forEach((i) => {
    totalPedido += i.precio * i.cantidadComida;
  });

  let propina5 = totalPedido * 0.05;
  let propina10 = totalPedido * 0.1;

  divTotal.classList.add("fw-bold", "py-3");

  propina1.onchange = function () {
    if (propina1.checked) {
      divTotal.innerHTML = `Total a pagar: $${totalPedido + propina5}`;
      containerPropinas.appendChild(divTotal);
    }
  };
  propina2.onchange = function () {
    if (propina2.checked) {
      divTotal.innerHTML = `Total a pagar: $${totalPedido + propina10}`;
      containerPropinas.appendChild(divTotal);
    }
  };
  container2.appendChild(containerPropinas);
}

function actualizarResumen() {
  const div = document.createElement("div");
  div.classList.add("card", "py-5", "px=3", "shadow", "col-md-4");
  let { pedido, hora, mesa } = cliente;

  const containerMesa = document.createElement("div");
  containerMesa.classList.add("fw-bold");
  containerMesa.innerText = `Mesa: ${mesa}
    `;
  const containerHora = document.createElement("div");
  containerHora.classList.add("fw-bold");
  containerHora.innerText = `Hora: ${hora}`;

  const containerPedido = document.createElement("div");
  containerPedido.innerHTML = `
    <h2>Pedidos: </h2>`;

  const agrupar = document.createElement("ul");

  pedido.forEach((i) => {
    const { id, nombre, precio, categoria, cantidadComida: cantidad } = i;
    const lista = document.createElement("li");

    lista.classList.add("my-5", "list-group-item");
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("btn", "btn-danger");
    deleteBtn.textContent = "Eliminar pedido";
    deleteBtn.addEventListener("click", () => {
      eliminarProducto(id);
    });

    const nombreP = document.createElement("p");
    nombreP.textContent = nombre;
    const precioP = document.createElement("p");
    precioP.textContent = `Precio: $${precio}`;
    const categoriaP = document.createElement("p");
    categoriaP.textContent = `Categoria: ${categorias[categoria]}`;
    const cantidadP = document.createElement("p");
    cantidadP.textContent = `Cantidad: ${cantidad}`;

    subTotalVal = calcularSubtotal(i);
    subTotal = document.createElement("p");
    subTotal.textContent = `Subtotal: $${subTotalVal}`;

    lista.appendChild(nombreP);
    lista.appendChild(precioP);
    lista.appendChild(categoriaP);
    lista.appendChild(cantidadP);
    lista.appendChild(subTotal);
    lista.appendChild(deleteBtn);

    agrupar.appendChild(lista);
  });

  div.appendChild(containerMesa);
  div.appendChild(containerHora);
  div.appendChild(containerPedido);
  div.appendChild(agrupar);

  container2.appendChild(div);
}

function calcularSubtotal(i) {
  return i.precio * i.cantidadComida;
}

function eliminarProducto(id) {
  cliente.pedido = cliente.pedido.filter((item) => item.id !== id);
  const listaInputs = document.querySelectorAll(
    "#container .row .form-control"
  );

  for (let i = 0; i < listaInputs.length; i++) {
    const input = listaInputs[i];
    if (input.id === id) {
      input.value = 0;
    }
  }

  container2.innerHTML = "";
  if (cliente.pedido.length) {
    actualizarResumen();
    actualizarTotal();
  } else {
    container2.innerHTML = `<p class="text-center">Añade los elementos del pedido</p>`;
  }
}
