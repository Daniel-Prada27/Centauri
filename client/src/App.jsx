import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Register from './app/auth/register.jsx'
import Login from './app/auth/login.jsx';

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {showLogin ? <Login /> : <Register />}
      <button
        onClick={() => setShowLogin(!showLogin)}
        style={{
          marginTop: 20,
          background: "none",
          border: "1px solid #0078ff",
          borderRadius: 6,
          padding: "6px 12px",
          cursor: "pointer",
        }}
      >
        {showLogin ? "Go to Register" : "Go to Login"}
      </button>
    </div>
  );
}

// function App() {
//   return <Register />;
// }

export default App
