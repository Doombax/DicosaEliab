import React, { useState, useEffect } from "react";
import { Table, Spinner, Button } from "react-bootstrap";

const TablaProductos = ({
  productos,
  abrirModalEdicion,
  abrirModalEliminacion,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productos && productos.length >= 0) {
      setLoading(false);
    }
  }, [productos]);

  return (
    <>
      {loading ? (
        <div className="text-center">
          <h4>Cargando productos...</h4>

          <Spinner animation="border" variant="success" role="status" />
        </div>
      ) : (
        <Table striped borderless hover responsive size="sm">
          <thead>
            <tr>
              <th>id_producto</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {productos.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No hay productos registrados
                </td>
              </tr>
            ) : (
              productos.map((productos) => (
                <tr key={productos.id_producto}>
                  <td>{productos.id_producto}</td>
                  <td>{productos.nombre_producto}</td>
                  <td>{productos.descripcion_producto}</td>
                  <td>${productos.precio_venta.toFixed(2)}</td>

                  <td className="text-center">
                    <Button
                      variant="outline-warning"
                      size="sm"
                      className="m-1"
                      onClick={() => abrirModalEdicion(productos)}
                    >
                      Editar
                    </Button>

                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => abrirModalEliminacion(productos)}
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

export default TablaProductos;
