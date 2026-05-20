import React, { useEffect, useState } from "react";

import { Container, Row, Col, Form } from "react-bootstrap";

import { supabase } from "../database/supabaseconfig";

import TarjetaCatalogo from "../components/catalogo/TarjetaCatalogo";

import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";

const Catalogo = () => {
  const [productos, setProductos] = useState([]);

  const [categorias, setCategorias] = useState([]);

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [productosFiltrados, setProductosFiltrados] = useState([]);

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  useEffect(() => {
    filtrarProductos();
  }, [productos, textoBusqueda, categoriaSeleccionada]);

  const cargarProductos = async () => {
    try {
      const { data, error } = await supabase.from("productos").select("*");

      if (error) throw error;

      setProductos(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const cargarCategorias = async () => {
    try {
      const { data, error } = await supabase.from("categorias").select("*");

      if (error) throw error;

      setCategorias(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const filtrarProductos = () => {
    let filtrados = [...productos];

    if (categoriaSeleccionada) {
      filtrados = filtrados.filter(
        (producto) => producto.categoria_producto === categoriaSeleccionada,
      );
    }

    if (textoBusqueda.trim()) {
      const texto = textoBusqueda.toLowerCase();

      filtrados = filtrados.filter((producto) =>
        producto.nombre_producto?.toLowerCase().includes(texto),
      );
    }

    setProductosFiltrados(filtrados);
  };

  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  const manejarCategoria = (e) => {
    setCategoriaSeleccionada(e.target.value);
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Catálogo de Productos</h2>

      <Row className="mb-4">
        <Col md={4}>
          <Form.Select
            value={categoriaSeleccionada}
            onChange={manejarCategoria}
          >
            <option value="">Todas las categorías</option>

            {categorias.map((categoria) => (
              <option
                key={categoria.id_categoria}
                value={categoria.nombre_categoria}
              >
                {categoria.nombre_categoria}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col md={8}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarBusqueda}
          />
        </Col>
      </Row>

      <Row>
        {productosFiltrados.map((producto) => (
          <Col md={4} key={producto.id_producto} className="mb-4">
            <TarjetaCatalogo producto={producto} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Catalogo;
