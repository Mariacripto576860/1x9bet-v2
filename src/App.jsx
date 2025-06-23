import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Menu from "./pages/Menu";
import Deposito from "./pages/Deposito";
import Saque from "./pages/Saque";
import LoginSuporte from "./pages/LoginSuporte";
import Suporte from "./pages/Suporte";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/deposito" element={<Deposito />} /> {/* 👈 ADICIONE ESTA LINHA */}
        <Route path="/saque" element={<Saque />} /> 
        <Route path="/login-suporte" element={<LoginSuporte />} />
        <Route path="/suporte" element={<Suporte />} />
      </Routes>
    </Router>
  );
}

export default App;