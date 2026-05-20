import React, { useState, useEffect } from "react";
import { Table, Spinner, Button } from "react-bootstrap";

const TablaClientes = ({
  clientes,
  abrirModalEdicion,
  abrirModalEliminacion,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clientes && clientes.length >= 0) {
      setLoading(false);
    }
  }, [clientes]);

  return (
    <>
      {loading ? (
        <div className="text-center">
          <h4>Cargando clientes...</h4>

          <Spinner animation="border" variant="success" role="status" />
        </div>
      ) : (
        <Table striped borderless hover responsive size="sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Celular</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {clientes.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No hay clientes registrados
                </td>
              </tr>
            ) : (
              clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.id}</td>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.apellido}</td>
                  <td>{cliente.celular}</td>

                  <td className="text-center">
                    <Button
                      variant="outline-warning"
                      size="sm"
                      className="m-1"
                      onClick={() => abrirModalEdicion(cliente)}
                    >
                      Editar
                    </Button>

                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => abrirModalEliminacion(cliente)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default TablaClientes;
