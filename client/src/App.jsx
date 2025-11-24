import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import ProfilePage from "./Pages/ProfilePage";
import Register from "./Pages/Register";
import TeamsPage from "./Pages/TeamsPage";
import BoardPage from "./Pages/BoardPage";
import PublicRoute from "./Routes/PublicRoute";
import PrivateRoute from "./Routes/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Página principal pública */}
        <Route path="/" element={<Home />} />

        {/* Rutas públicas: solo accesibles si NO estás logueado */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/teamspage" element={<TeamsPage />} />
          <Route path="/boardpage/:id" element={<BoardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Rutas privadas: solo accesibles si SÍ estás logueado */}
        <Route element={<PrivateRoute />}>

        </Route>

        {/* Redirección en caso de ruta no existente */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
