import React, { useState } from "react";

import { Card, Button, Modal } from "react-bootstrap";

const TarjetaCatalogo = ({ producto }) => {
  const [mostrarModal, setMostrarModal] = useState(false);

  const abrirModal = () => {
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
  };

  const descripcionCorta =
    producto.descripcion_producto?.length > 80
      ? producto.descripcion_producto.slice(0, 80) + "..."
      : producto.descripcion_producto;

  return (
    <>
      <Card className="shadow-sm h-100">
        <Card.Img
          variant="top"
          src={producto.url_imagen}
          style={{
            height: "250px",
            objectFit: "cover",
          }}
        />

        <Card.Body>
          <Card.Title>{producto.nombre_producto}</Card.Title>

          <Card.Text>{descripcionCorta}</Card.Text>

          <h5 className="mb-3">C$ {producto.precio_venta}</h5>

          <Button variant="primary" onClick={abrirModal}>
            Ver Detalles
          </Button>
        </Card.Body>
      </Card>

      <Modal show={mostrarModal} onHide={cerrarModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{producto.nombre_producto}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <img
            src={producto.url_imagen}
            alt={producto.nombre_producto}
            className="img-fluid rounded mb-3"
          />

          <p>
            <strong>Categoría:</strong> {producto.categoria_producto}
          </p>

          <p>
            <strong>Descripción:</strong> {producto.descripcion_producto}
          </p>

          <h4>C$ {producto.precio_venta}</h4>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TarjetaCatalogo;
