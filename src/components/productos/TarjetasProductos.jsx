import React, { useState, useEffect, useCallback } from "react";

import { Card, Row, Col, Spinner, Button } from "react-bootstrap";

import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaProducto = ({
  productos,
  abrirModalEdicion,
  abrirModalEliminacion,
}) => {
  const [loading, setLoading] = useState(true);

  const [idTarjetaActiva, setIdTarjetaActiva] = useState(null);

  useEffect(() => {
    if (productos) {
      setLoading(false);
    }
  }, [productos]);

  const manejarTeclaEscape = useCallback((evento) => {
    if (evento.key === "Escape") {
      setIdTarjetaActiva(null);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", manejarTeclaEscape);

    return () => {
      window.removeEventListener("keydown", manejarTeclaEscape);
    };
  }, [manejarTeclaEscape]);

  const alternarTarjetaActiva = (id_producto) => {
    setIdTarjetaActiva((prev) => (prev === id_producto ? null : id_producto));
  };

  return (
    <>
      {loading ? (
        <div className="text-center my-5">
          <h5>Cargando productos...</h5>

          <Spinner animation="border" variant="success" />
        </div>
      ) : productos.length === 0 ? (
        <div className="text-center">
          <h5>No hay productos registrados</h5>
        </div>
      ) : (
        productos.map((producto) => {
          const tarjetaActiva = idTarjetaActiva === producto.id_producto;

          return (
            <Card
              key={producto.id_producto}
              className="mb-3 shadow-sm"
              onClick={() => alternarTarjetaActiva(producto.id_producto)}
            >
              <Card.Body>
                <Row className="align-items-center">
                  <Col xs={3}>
                    {producto.url_imagen ? (
                      <img
                        src={producto.url_imagen}
                        alt={producto.nombre_producto}
                        className="img-fluid rounded"
                      />
                    ) : (
                      <i className="bi bi-image fs-1"></i>
                    )}
                  </Col>

                  <Col xs={6}>
                    <h5>{producto.nombre_producto}</h5>

                    <p className="text-muted mb-1">
                      {producto.descripcion_producto}
                    </p>

                    <strong>${Number(producto.precio_venta).toFixed(2)}</strong>
                  </Col>

                  <Col xs={3} className="text-end">
                    <Button
                      variant="outline-warning"
                      size="sm"
                      className="me-2"
                      onClick={(e) => {
                        e.stopPropagation();

                        abrirModalEdicion(producto);
                      }}
                    >
                      Editar
                    </Button>

                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();

                        abrirModalEliminacion(producto);
                      }}
                    >
                      Eliminar
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          );
        })
      )}
    </>
  );
};

export default TarjetaProducto;
