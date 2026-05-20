import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Encabezado from "./components/navegacion/Encabezado";

import Inicio from "./views/Inicio";
import Categorias from "./views/Categorias";
import Catalogo from "./views/Catalogo";
import Productos from "./views/Productos";
import Login from "./views/Login";
import RutaProtegida from "./components/rutas/RutaProtegida";
import Pagina404 from "./views/Pagina404";
import Empleados from "./views/Empleados";
import Clientes from "./views/Clientes";
import Permisos from "./views/Permisos";

import "./App.css";

const App = () => {
  return (
    <Router>
      <Encabezado />

      <main className="margen-superior-main">
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <RutaProtegida>
                <Inicio />
              </RutaProtegida>
            }
          />
          <Route
            path="/categorias"
            element={
              <RutaProtegida permiso="ver_categorias">
                <Categorias />
              </RutaProtegida>
            }
          />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route
            path="/productos"
            element={
              <RutaProtegida permiso="ver_productos">
                <Productos />
              </RutaProtegida>
            }
          />
          <Route
            path="/empleados"
            element={
              <RutaProtegida permiso="ver_empleados">
                <Empleados />
              </RutaProtegida>
            }
          />

          <Route
            path="/permisos"
            element={
              <RutaProtegida permiso="ver_permisos">
                <Permisos />
              </RutaProtegida>
            }
          />

          <Route
            path="/clientes"
            element={
              <RutaProtegida permiso="ver_clientes">
                <Clientes />
              </RutaProtegida>
            }
          />

          <Route path="*" element={<Pagina404 />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
