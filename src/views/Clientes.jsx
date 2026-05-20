import React, { useState, useEffect } from "react";

import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";

import { supabase } from "../database/supabaseconfig";

import ModalRegistroCliente from "../components/clientes/ModalRegistroCliente";
import ModalEdicionCliente from "../components/clientes/ModalEdicionCliente";
import ModalEliminacionCliente from "../components/clientes/ModalEliminacionCliente";

import TablaClientes from "../components/clientes/TablaClientes";
import TarjetaCliente from "../components/clientes/TarjetasClientes";

import NotificacionOperacion from "../components/NotificacionOperacion";

import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";

const Clientes = () => {
  const [toast, setToast] = useState({
    mostrar: false,
    mensaje: "",
    tipo: "",
  });

  const [mostrarModal, setMostrarModal] = useState(false);

  const [clientes, setClientes] = useState([]);

  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    apellido: "",
    celular: "",
  });

  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);

  const [clienteAEliminar, setClienteAEliminar] = useState(null);

  const [clienteEditar, setClienteEditar] = useState({
    id: "",
    nombre: "",
    apellido: "",
    celular: "",
  });

  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [clientesFiltrados, setClientesFiltrados] = useState([]);

  const [cargando, setCargando] = useState(true);

  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(5);

  const [paginaActual, establecerPaginaActual] = useState(1);

  const cargarClientes = async () => {
    try {
      setCargando(true);

      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error(error.message);

        setToast({
          mostrar: true,
          mensaje: "Error al cargar clientes",
          tipo: "error",
        });

        return;
      }

      setClientes(data || []);
    } catch (err) {
      console.error(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setClientesFiltrados(clientes);
    } else {
      const textoLower = textoBusqueda.toLowerCase();

      const filtrados = clientes.filter(
        (cli) =>
          cli.nombre.toLowerCase().includes(textoLower) ||
          cli.apellido.toLowerCase().includes(textoLower) ||
          cli.celular.toLowerCase().includes(textoLower),
      );

      setClientesFiltrados(filtrados);
    }
  }, [textoBusqueda, clientes]);

  const manejoCambioInput = (e) => {
    const { name, value } = e.target;

    setNuevoCliente((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;

    setClienteEditar((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const agregarCliente = async () => {
    try {
      const { error } = await supabase.from("clientes").insert([nuevoCliente]);

      if (error) {
        console.error(error.message);

        setToast({
          mostrar: true,
          mensaje: "Error al registrar cliente",
          tipo: "error",
        });

        return;
      }

      setMostrarModal(false);

      setNuevoCliente({
        nombre: "",
        apellido: "",
        celular: "",
      });

      await cargarClientes();

      setToast({
        mostrar: true,
        mensaje: "Cliente agregado exitosamente",
        tipo: "exito",
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  const abrirModalEdicion = (cliente) => {
    setClienteEditar(cliente);

    setMostrarModalEdicion(true);
  };

  const actualizarCliente = async () => {
    try {
      const { error } = await supabase
        .from("clientes")
        .update(clienteEditar)
        .eq("id", clienteEditar.id);

      if (error) {
        console.error(error.message);

        setToast({
          mostrar: true,
          mensaje: "Error al actualizar cliente",
          tipo: "error",
        });

        return;
      }

      setMostrarModalEdicion(false);

      await cargarClientes();

      setToast({
        mostrar: true,
        mensaje: "Cliente actualizado",
        tipo: "exito",
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  const abrirModalEliminacion = (cliente) => {
    setClienteAEliminar(cliente);

    setMostrarModalEliminacion(true);
  };

  const eliminarCliente = async () => {
    try {
      const { error } = await supabase
        .from("clientes")
        .delete()
        .eq("id", clienteAEliminar.id);

      if (error) {
        console.error(error.message);

        setToast({
          mostrar: true,
          mensaje: "Error al eliminar cliente",
          tipo: "error",
        });

        return;
      }

      await cargarClientes();

      setToast({
        mostrar: true,
        mensaje: "Cliente eliminado",
        tipo: "exito",
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  return (
    <Container className="mt-3">
      <Row className="align-items-center mb-3">
        <Col xs={9} sm={7} md={7} lg={7} className="d-flex align-items-center">
          <h3 className="mb-0">
            <i className="bi bi-people-fill me-2"></i>
            Clientes
          </h3>
        </Col>

        <Col xs={3} sm={5} md={5} lg={5} className="text-end">
          <Button onClick={() => setMostrarModal(true)} size="md">
            <i className="bi-plus-lg"></i>

            <span className="d-none d-sm-inline ms-2">Nuevo Cliente</span>
          </Button>
        </Col>
      </Row>

      <hr />

      <Row className="mb-4">
        <Col md={6} lg={5}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarBusqueda}
            placeholder="Buscar cliente..."
          />
        </Col>
      </Row>

      {!cargando && textoBusqueda.trim() && clientesFiltrados.length === 0 && (
        <Row className="mb-4">
          <Col>
            <Alert variant="info" className="text-center">
              No se encontraron clientes
            </Alert>
          </Col>
        </Row>
      )}

      {cargando && (
        <Row className="text-center my-5">
          <Col>
            <Spinner animation="border" variant="success" size="lg" />

            <p className="mt-3 text-muted">Cargando clientes...</p>
          </Col>
        </Row>
      )}

      {!cargando && clientesFiltrados.length > 0 && (
        <Row>
          <Col xs={12} sm={12} md={12} className="d-lg-none">
            <TarjetaCliente
              clientes={clientesFiltrados}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />
          </Col>

          <Col lg={12} className="d-none d-lg-block">
            <TablaClientes
              clientes={clientesFiltrados}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />
          </Col>
        </Row>
      )}

      <ModalRegistroCliente
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoCliente={nuevoCliente}
        manejoCambioInput={manejoCambioInput}
        agregarCliente={agregarCliente}
      />

      <ModalEdicionCliente
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        clienteEditar={clienteEditar}
        manejoCambioInputEdicion={manejoCambioInputEdicion}
        actualizarCliente={actualizarCliente}
      />

      <ModalEliminacionCliente
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarCliente={eliminarCliente}
        cliente={clienteAEliminar}
      />

      {clientesFiltrados.length > 0 && (
        <Paginacion
          registrosPorPagina={registrosPorPagina}
          totalRegistros={clientesFiltrados.length}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
          establecerRegistrosPorPagina={establecerRegistrosPorPagina}
        />
      )}

      <NotificacionOperacion
        mostrar={toast.mostrar}
        mensaje={toast.mensaje}
        tipo={toast.tipo}
        onCerrar={() =>
          setToast({
            ...toast,
            mostrar: false,
          })
        }
      />
    </Container>
  );
};

export default Clientes;
