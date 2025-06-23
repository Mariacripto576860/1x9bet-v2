// src/pages/Deposito.jsx
import React, { useState } from "react";
import { db, auth } from "../firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/Deposito.css";

function Deposito() {
  const [valorSelecionado, setValorSelecionado] = useState(null);
  const [comprovante, setComprovante] = useState(null);
  const [nomeConta, setNomeConta] = useState(""); // Novo campo
  const navigate = useNavigate();

  const chavePix = "11998283330"; // Chave Pix

  const copiarChavePix = () => {
    navigator.clipboard.writeText(chavePix);
    alert("Chave Pix copiada com sucesso!");
  };

  const handleComprovante = (e) => {
    setComprovante(e.target.files[0]);
  };

  const enviarComprovante = async () => {
    if (!valorSelecionado || !comprovante || !nomeConta.trim()) {
      return alert("Preencha todos os campos e envie o comprovante.");
    }

    const user = auth.currentUser;
    if (!user) return alert("Usuário não autenticado.");

    try {
      await addDoc(collection(db, "depositosPendentes"), {
        uid: user.uid,
        valor: valorSelecionado,
        nomeConta: nomeConta.trim(),
        enviadoEm: Timestamp.now(),
        nomeArquivo: comprovante.name,
        status: "pendente",
      });

      alert("Comprovante enviado com sucesso! Aguarde a confirmação do suporte.");
      navigate("/menu");
    } catch (error) {
      console.error("Erro ao enviar:", error);
      alert("Erro ao enviar o comprovante.");
    }
  };

  return (
    <div className="deposito-container">
      <h2>📥 Depósito</h2>
      <p>Escolha um valor para depósito:</p>

      <div className="valores-grid">
        {[10, 25, 50, 100, 200, 500, 1000].map((valor) => (
          <button
            key={valor}
            className={valorSelecionado === valor ? "ativo" : ""}
            onClick={() => setValorSelecionado(valor)}
          >
            R$ {valor}
          </button>
        ))}
      </div>

      <div className="chave-pix">
        <p>Chave Pix:</p>
        <input type="text" readOnly value={chavePix} />
        <button onClick={copiarChavePix}>Copiar</button>
      </div>

      <div className="nome-conta">
        <label>👤 Nome da Conta que fez o depósito:</label>
        <input
          type="text"
          value={nomeConta}
          onChange={(e) => setNomeConta(e.target.value)}
          placeholder="Ex: João Silva"
        />
      </div>

      <div className="upload-comprovante">
        <label>📎 Enviar Comprovante:</label>
        <input type="file" onChange={handleComprovante} />
      </div>

      <button className="enviar" onClick={enviarComprovante}>
        Enviar Comprovante
      </button>
    </div>
  );
}

export default Deposito;