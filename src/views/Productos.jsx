import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

import ModalRegistroProducto from "../components/productos/ModalRegistroProducto";
import ModalEdicionProducto from "../components/productos/ModalEdicionProducto";
import ModalEliminacionProducto from "../components/productos/ModalEliminacionProducto";

import NotificacionOperacion from "../components/NotificacionOperacion";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";

import TarjetaProducto from "../components/productos/TarjetasProductos";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  const [categorias, setCategorias] = useState([]);

  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [cargando, setCargando] = useState(true);

  const [mostrarModal, setMostrarModal] = useState(false);

  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);

  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_producto: "",
    descripcion_producto: "",
    categoria_producto: "",
    precio_venta: "",
    url_imagen: "",
    archivo: null,
  });

  const [productoEditar, setProductoEditar] = useState({
    id_producto: "",
    nombre_producto: "",
    descripcion_producto: "",
    categoria_producto: "",
    precio_venta: "",
    url_imagen: "",
    archivo: null,
  });

  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const [toast, setToast] = useState({
    mostrar: false,
    mensaje: "",
    tipo: "",
  });

  const manejoCambioInput = (e) => {
    const { name, value } = e.target;

    setNuevoProducto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const manejoCambioArchivo = (e) => {
    const archivo = e.target.files[0];

    if (archivo && archivo.type.startsWith("image/")) {
      setNuevoProducto((prev) => ({
        ...prev,
        archivo,
      }));
    } else {
      alert("Por favor, selecciona un archivo de imagen válido.");
    }
  };

  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setProductosFiltrados(productos);
    } else {
      const textoLower = textoBusqueda.toLowerCase().trim();

      const filtrados = productos.filter((prod) => {
        const nombre = prod.nombre_producto?.toLowerCase() || "";

        const descripcion = prod.descripcion_producto?.toLowerCase() || "";

        const precio = prod.precio_venta?.toString().toLowerCase() || "";

        return (
          nombre.includes(textoLower) ||
          descripcion.includes(textoLower) ||
          precio.includes(textoLower)
        );
      });

      setProductosFiltrados(filtrados);
    }
  }, [textoBusqueda, productos]);

  useEffect(() => {
    cargarCategorias();
    cargarProductos();
  }, []);

  const cargarCategorias = async () => {
    try {
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .order("id_categoria", {
          ascending: true,
        });

      if (error) throw error;

      setCategorias(data || []);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  const cargarProductos = async () => {
    try {
      setCargando(true);

      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .order("id_producto", {
          ascending: true,
        });

      if (error) throw error;

      setProductos(data || []);
      setProductosFiltrados(data || []);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setCargando(false);
    }
  };

  const abrirModalEdicion = (productos) => {
    setProductoEditar(productos);

    setMostrarModalEdicion(true);
  };

  const cerrarModalEdicion = () => {
    setMostrarModalEdicion(false);
  };

  const manejoCambioArchivoEditar = (e) => {
    const archivo = e.target.files[0];

    if (archivo && archivo.type.startsWith("image/")) {
      setProductoEditar((prev) => ({
        ...prev,
        archivo,
      }));
    } else {
      alert("Seleccione una imagen válida");
    }
  };

  const actualizarProducto = async () => {
    try {
      if (
        !productoEditar.nombre_producto ||
        !productoEditar.categoria_producto ||
        !productoEditar.precio_venta
      ) {
        alert("Complete todos los campos");

        return;
      }

      let urlImagen = productoEditar.url_imagen;

      if (productoEditar.archivo) {
        const nombreArchivo = Date.now() + "_" + productoEditar.archivo.name;

        const { error: uploadError } = await supabase.storage
          .from("imagenes_productos")
          .upload(nombreArchivo, productoEditar.archivo);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("imagenes_productos")
          .getPublicUrl(nombreArchivo);

        urlImagen = data.publicUrl;

        if (productoEditar.url_imagen) {
          const nombreImagenAnterior = productoEditar.url_imagen
            .split("/")
            .pop();

          await supabase.storage
            .from("imagenes_productos")
            .remove([nombreImagenAnterior]);
        }
      }

      const { error } = await supabase
        .from("productos")
        .update({
          nombre_producto: productoEditar.nombre_producto,

          descripcion_producto: productoEditar.descripcion_producto,

          categoria_producto: productoEditar.categoria_producto,

          precio_venta: productoEditar.precio_venta,

          url_imagen: urlImagen,
        })
        .eq("id_producto", productoEditar.id_producto);

      if (error) throw error;

      await cargarProductos();

      cerrarModalEdicion();

      setToast({
        mostrar: true,
        mensaje: "Producto actualizado correctamente",
        tipo: "success",
      });
    } catch (error) {
      console.error(error);

      setToast({
        mostrar: true,
        mensaje: "Error al actualizar producto",
        tipo: "danger",
      });
    }
  };
  const agregarProducto = async () => {
    try {
      if (
        !nuevoProducto.nombre_producto ||
        !nuevoProducto.categoria_producto ||
        !nuevoProducto.precio_venta ||
        !nuevoProducto.archivo
      ) {
        alert("Complete todos los campos");

        return;
      }

      const nombreArchivo = Date.now() + "_" + nuevoProducto.archivo.name;

      const { error: uploadError } = await supabase.storage
        .from("imagenes_productos")
        .upload(nombreArchivo, nuevoProducto.archivo);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("imagenes_productos")
        .getPublicUrl(nombreArchivo);

      const urlImagen = data.publicUrl;

      const { error } = await supabase.from("productos").insert([
        {
          nombre_producto: nuevoProducto.nombre_producto,

          descripcion_producto: nuevoProducto.descripcion_producto,

          categoria_producto: nuevoProducto.categoria_producto,

          precio_venta: nuevoProducto.precio_venta,

          url_imagen: urlImagen,
        },
      ]);

      if (error) throw error;

      await cargarProductos();

      setMostrarModal(false);

      setToast({
        mostrar: true,
        mensaje: "Producto agregado correctamente",
        tipo: "success",
      });
    } catch (error) {
      console.error(error);

      setToast({
        mostrar: true,
        mensaje: "Error al agregar producto",
        tipo: "danger",
      });
    }
  };

   const eliminarProducto = async () => {
      if (!productoAEliminar) return;
      try {
        setMostrarModalEliminacion(false);
  
        const { error } = await supabase
          .from("productos")
          .delete()
          .eq("id_producto", productoAEliminar.id_producto);
  
        if (error) {
          console.error("Error al eliminar producto:", error.message);
          setToast({
            mostrar: true,
            mensaje: `Error al eliminar el producto ${productoAEliminar.nombre_producto}.`,
            tipo: "error",
          });
          return;
        }
  
        await cargarProductos();
        setToast({
          mostrar: true,
          mensaje: `Producto ${productoAEliminar.nombre_producto} eliminado exitosamente.`,
          tipo: "exito",
        });
      } catch (err) {
        setToast({
          mostrar: true,
          mensaje: "Error inesperado al eliminar producto.",
          tipo: "error",
        });
        console.error("Excepción al eliminar producto:", err.message);
      }
    };

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col>
          <h2>Productos</h2>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarBusqueda}
          />
        </Col>

        <Col md={6} className="text-end">
          <Button onClick={() => setMostrarModal(true)}>Nuevo Producto</Button>
        </Col>
      </Row>

      <Row>
        {productosFiltrados.map((producto) => (
          <Col md={4} key={producto.id_producto} className="mb-3">
            <TarjetaProducto
              producto={producto}
              abrirModalEdicion={abrirModalEdicion}
            />
          </Col>
        ))}
      </Row>

      <ModalRegistroProducto
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoProducto={nuevoProducto}
        setNuevoProducto={setNuevoProducto}
        manejoCambioInput={manejoCambioInput}
        manejoCambioArchivo={manejoCambioArchivo}
        categorias={categorias}
        agregarProducto={agregarProducto}
      />

      <ModalEdicionProducto
        show={mostrarModalEdicion}
        handleClose={cerrarModalEdicion}
        productoEditar={productoEditar}
        setProductoEditar={setProductoEditar}
        actualizarProducto={actualizarProducto}
        setNuevaImagen={manejoCambioArchivoEditar}
        categorias={categorias}
      />
      <ModalEliminacionProducto
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarProducto={eliminarProducto}
        producto={productoAEliminar}
      />

      <NotificacionOperacion
        toast={toast}
        onCerrar={() =>
          setToast({
            mostrar: false,
            mensaje: "",
            tipo: "",
          })
        }
      />
    </Container>
  );
};

export default Productos;