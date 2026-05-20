import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalEliminacionEmpleado = ({
  mostrarModalEliminacion,
  setMostrarModalEliminacion,
  eliminarEmpleado,
  empleado,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleEliminar = async () => {
    if (deshabilitado) return;

    setDeshabilitado(true);

    await eliminarEmpleado();

    setDeshabilitado(false);

    setMostrarModalEliminacion(false);
  };

  return (
    <Modal
      show={mostrarModalEliminacion}
      onHide={() => setMostrarModalEliminacion(false)}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Confirmar Eliminación
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>
              ¿Eliminar empleado{" "}
              <strong>{empleado?.nombre}</strong>?
            </Form.Label>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() =>
            setMostrarModalEliminacion(false)
          }
        >
          Cancelar
        </Button>

        <Button
          variant="danger"
          onClick={handleEliminar}
          disabled={deshabilitado}
        >
          {deshabilitado
            ? "Eliminando..."
            : "Eliminar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionEmpleado;