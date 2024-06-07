const url = "/api/foods";
// consultar todo
export async function consultarBD() {
  try {
    const menu = await axios.get(url);
    return menu.data;
  } catch (err) {
    return 404;
  }
}

// agregar

export async function agregarBD(producto) {
  try {
    await axios.post(url, {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      categoria: producto.categoria,
    });
  } catch (err) {
    console.log(err);
  }
}

//eliminar

export async function eliminardelaBD(id) {
  try {
    await axios.delete(url, {
      params: { id: id },
    });
  } catch (err) {
    console.log(err);
  }
}

//actualizar

export async function editarBD(producto) {
  try {
    await axios.put(url, {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      categoria: producto.categoria,
    });
  } catch (err) {
    console.log(err);
  }
}

//consultar por id

export async function consultaIDBD(id) {
  try {
    const producto = await axios.get(url, {
      params: {
        id: id,
      },
    });
    return producto.data;
  } catch (err) {
    return 404;
  }
}
