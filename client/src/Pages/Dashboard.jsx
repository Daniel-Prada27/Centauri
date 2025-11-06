// components/Dashboard.js
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>¡Bienvenido al Dashboard!</h1>
      <p>Estás logueado.</p>
      <button onClick={handleLogout} style={{
        padding: '10px 20px',
        background: '#0052cc',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer'
      }}>
        Cerrar Sesión
      </button>
    </div>
  );
}

export default Dashboard;