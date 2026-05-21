import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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

  const [mostrarModal, setMostrarModal] = useState(false);

  const [mostrarModalEliminacion, setMostrarModalEliminacion] =
    useState(false);

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
      alert("Seleccione una imagen válida");
    }
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

  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  useEffect(() => {
    cargarCategorias();
    cargarProductos();
  }, []);

  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setProductosFiltrados(productos);
    } else {
      const textoLower = textoBusqueda.toLowerCase();

      const filtrados = productos.filter((producto) => {
        const nombre =
          producto.nombre_producto?.toLowerCase() || "";

        const descripcion =
          producto.descripcion_producto?.toLowerCase() || "";

        const precio =
          producto.precio_venta?.toString() || "";

        return (
          nombre.includes(textoLower) ||
          descripcion.includes(textoLower) ||
          precio.includes(textoLower)
        );
      });

      setProductosFiltrados(filtrados);
    }
  }, [textoBusqueda, productos]);

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
      console.error("Error cargando categorías:", error);
    }
  };

  const cargarProductos = async () => {
    try {
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
      console.error("Error cargando productos:", error);
    }
  };

  const abrirModalEdicion = (producto) => {
    setProductoEditar(producto);
    setMostrarModalEdicion(true);
  };

  const cerrarModalEdicion = () => {
    setMostrarModalEdicion(false);
  };

  const abrirModalEliminacion = (producto) => {
    setProductoAEliminar(producto);
    setMostrarModalEliminacion(true);
  };

  const actualizarProducto = async () => {
    try {
      let urlImagen = productoEditar.url_imagen;

      if (productoEditar.archivo) {
        const nombreArchivo =
          Date.now() + "_" + productoEditar.archivo.name;

        const { error: uploadError } = await supabase.storage
          .from("imagenes_productos")
          .upload(nombreArchivo, productoEditar.archivo);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("imagenes_productos")
          .getPublicUrl(nombreArchivo);

        urlImagen = data.publicUrl;
      }

      const { error } = await supabase
        .from("productos")
        .update({
          nombre_producto: productoEditar.nombre_producto,
          descripcion_producto:
            productoEditar.descripcion_producto,
          categoria_producto:
            productoEditar.categoria_producto,
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
      const nombreArchivo =
        Date.now() + "_" + nuevoProducto.archivo.name;

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
          descripcion_producto:
            nuevoProducto.descripcion_producto,
          categoria_producto:
            nuevoProducto.categoria_producto,
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
    try {
      const { error } = await supabase
        .from("productos")
        .delete()
        .eq("id_producto", productoAEliminar.id_producto);

      if (error) throw error;

      await cargarProductos();

      setMostrarModalEliminacion(false);

      setToast({
        mostrar: true,
        mensaje: "Producto eliminado correctamente",
        tipo: "success",
      });
    } catch (error) {
      console.error(error);

      setToast({
        mostrar: true,
        mensaje: "Error al eliminar producto",
        tipo: "danger",
      });
    }
  };

  // 👉 Método para generar PDF de un producto con imagen
  const generarPDFProducto = async (producto) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Reporte de Producto", 14, 20);
    doc.line(14, 25, 195, 25);

    let yPos = 35;

    // Lógica para incluir la imagen si existe
    if (producto.url_imagen) {
      try {
        const img = new Image();
        img.src = producto.url_imagen;
        img.crossOrigin = "Anonymous"; // Evita problemas de CORS
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        doc.addImage(img, "JPEG", 14, 35, 45, 45);
        yPos = 85; // Mueve la tabla hacia abajo para que no se encime con la imagen
      } catch (error) {
        console.error("Error cargando la imagen para el PDF:", error);
      }
    }

    autoTable(doc, {
      startY: yPos,
      head: [["Atributo", "Descripción"]],
      body: [
        ["ID", producto.id_producto],
        ["Nombre", producto.nombre_producto],
        ["Descripción", producto.descripcion_producto || "Sin descripción"],
        ["Precio de Venta", `$${Number(producto.precio_venta).toFixed(2)}`],
      ],
      headStyles: { fillColor: [25, 135, 84] }, // Verde success
    });

    doc.save(`producto_${producto.id_producto}.pdf`);
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
          <Button onClick={() => setMostrarModal(true)}>
            Nuevo Producto
          </Button>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <TarjetaProducto
            productos={productosFiltrados}
            abrirModalEdicion={abrirModalEdicion}
            abrirModalEliminacion={abrirModalEliminacion}
            generarPDFProducto={generarPDFProducto}
          />
        </Col>
      </Row>

      <ModalRegistroProducto
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoProducto={nuevoProducto}
        manejoCambioInput={manejoCambioInput}
        manejoCambioArchivo={manejoCambioArchivo}
        agregarProducto={agregarProducto}
        categorias={categorias}
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
        setMostrarModalEliminacion={
          setMostrarModalEliminacion
        }
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