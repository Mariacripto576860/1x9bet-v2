// src/pages/LoginSuporte.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../styles/LoginSuporte.css";

function LoginSuporte() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const fazerLogin = async (e) => {
    e.preventDefault();
    try {
      const credenciais = await signInWithEmailAndPassword(auth, email, senha);
      const user = credenciais.user;

      if (user.email === "suporte@1x9.com") {
        navigate("/suporte");
      } else {
        setErro("Acesso negado. E-mail não autorizado.");
      }
    } catch (err) {
      setErro("Erro ao fazer login. Verifique os dados.");
    }
  };

  return (
    <div className="login-suporte-container">
      <h2>Login Suporte</h2>
      <form onSubmit={fazerLogin}>
        <input
          type="email"
          placeholder="E-mail do suporte"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        {erro && <p className="erro">{erro}</p>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default LoginSuporte;