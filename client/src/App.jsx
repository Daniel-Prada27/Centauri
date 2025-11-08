// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import Register from './Pages/Register'; // ← Asegúrate de crearlo
import Dashboard from './Pages/Dashboard';
import PrivateRoute from './Routes/PrivateRoute';
import PublicRoute from './Routes/PublicRoute';

function App() {
  return (
    <Router>
      <Routes>

        {/* RUTAS PÚBLICAS */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* RUTAS PRIVADAS */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Puedes agregar más: /perfil, /proyectos, etc. */}
        </Route>

        {/* REDIRECCIÓN POR DEFECTO */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
}

export default App;
