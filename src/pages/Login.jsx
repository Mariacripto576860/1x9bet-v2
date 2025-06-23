// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "../styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const registrar = async () => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, senha);
      await setDoc(doc(db, "users", cred.user.uid), {
        saldo: 0,
        saque: [],
        deposito: [],
        historicoJogos: [],
      });
      navigate("/menu");
    } catch (error) {
      alert("Erro ao registrar: " + error.message);
    }
  };

  const logar = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigate("/menu");
    } catch (error) {
      alert("Erro ao logar: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <h1>
        Bem-vindo à <span className="logo">1x9bet</span>
      </h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <button onClick={logar}>Login</button>
      <button onClick={registrar}>Registrar</button>
    </div>
  );
}

export default Login;
