import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalEdicionProducto = ({
  show,
  handleClose,
  productoEditar,
  setProductoEditar,
  actualizarProducto,
  setNuevaImagen,
  categorias,
}) => {

  const [cargando, setCargando] = useState(false);

  const handleActualizar = async () => {

    if (cargando) return;

    setCargando(true);

    await actualizarProducto();

    setCargando(false);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>

      <Modal.Header closeButton>
        <Modal.Title>
          Editar Producto
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>

        <Form>

          <Form.Group className="mb-3">
            <Form.Label>Nombre del producto</Form.Label>

            <Form.Control
              type="text"
              name="nombre_producto"
              value={productoEditar.nombre_producto}
              onChange={(e) =>
                setProductoEditar({
                  ...productoEditar,
                  nombre_producto: e.target.value,
                })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>

            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion_producto"
              value={productoEditar.descripcion_producto}
              onChange={(e) =>
                setProductoEditar({
                  ...productoEditar,
                  descripcion_producto: e.target.value,
                })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>

            <Form.Select
              name="categoria_producto"
              value={productoEditar.categoria_producto}
              onChange={(e) =>
                setProductoEditar({
                  ...productoEditar,
                  categoria_producto: e.target.value,
                })
              }
            >

              <option value="">
                Seleccione una categoría
              </option>

              {categorias.map((categoria) => (
                <option
                  key={categoria.id_categoria}
                  value={categoria.nombre_categoria}
                >
                  {categoria.nombre_categoria}
                </option>
              ))}

            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio</Form.Label>

            <Form.Control
              type="number"
              name="precio_venta"
              value={productoEditar.precio_venta}
              onChange={(e) =>
                setProductoEditar({
                  ...productoEditar,
                  precio_venta: e.target.value,
                })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">

            <Form.Label>
              Imagen del producto
            </Form.Label>

            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) =>
                setNuevaImagen(e)
              }
            />

          </Form.Group>

          {productoEditar.url_imagen && (
            <div className="text-center">

              <img
                src={productoEditar.url_imagen}
                alt="Producto"
                className="img-fluid rounded"
                style={{
                  maxHeight: "200px",
                  objectFit: "cover",
                }}
              />

            </div>
          )}

        </Form>

      </Modal.Body>

      <Modal.Footer>

        <Button
          variant="secondary"
          onClick={handleClose}
        >
          Cancelar
        </Button>

        <Button
          variant="primary"
          onClick={handleActualizar}
          disabled={cargando}
        >
          {cargando
            ? "Actualizando..."
            : "Actualizar"}
        </Button>

      </Modal.Footer>

    </Modal>
  );
};

export default ModalEdicionProducto;