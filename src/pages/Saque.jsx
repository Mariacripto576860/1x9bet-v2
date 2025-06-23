import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  addDoc,
  collection,
  Timestamp,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/Saque.css";

function Saque() {
  const [valor, setValor] = useState("");
  const [chavePix, setChavePix] = useState("");
  const [saldo, setSaldo] = useState(0);
  const [saquesPendentes, setSaquesPendentes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarDados = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setSaldo(data.saldo || 0);
      }

      // Carrega saques pendentes
      const saquesRef = collection(db, "saquesPendentes");
      const q = query(saquesRef, where("uid", "==", user.uid), where("aprovado", "==", false));
      const saqueSnapshot = await getDocs(q);

      const listaPendentes = saqueSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSaquesPendentes(listaPendentes);
    };

    carregarDados();
  }, []);

  const enviarSolicitacao = async () => {
    const valorNumerico = parseFloat(valor);
    if (isNaN(valorNumerico) || valorNumerico < 10) {
      return alert("O valor mínimo para saque é R$ 10,00.");
    }

    if (!chavePix.trim()) {
      return alert("Informe a chave Pix para o saque.");
    }

    if (valorNumerico > saldo) {
      return alert("Saldo insuficiente.");
    }

    const user = auth.currentUser;
    if (!user) return alert("Usuário não autenticado.");

    try {
      // Cadastra o saque como pendente
      await addDoc(collection(db, "saquesPendentes"), {
        uid: user.uid,
        valor: valorNumerico,
        chavePix,
        data: Timestamp.now(),
        aprovado: false,
      });

      // Desconta o saldo do usuário
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        saldo: saldo - valorNumerico,
      });

      alert("Solicitação de saque enviada! Aguarde a confirmação do suporte.");
      navigate("/menu");
    } catch (error) {
      console.error("Erro ao solicitar saque:", error);
      alert("Erro ao solicitar saque.");
    }
  };

  return (
    <div className="saque-container">
      <h2>Solicitar Saque</h2>
      <p>Saldo disponível: R$ {saldo.toFixed(2)}</p>
      <p>Valor mínimo: R$ 10,00</p>

      <input
        type="number"
        placeholder="Valor do saque"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
      />
      <input
        type="text"
        placeholder="Sua chave Pix"
        value={chavePix}
        onChange={(e) => setChavePix(e.target.value)}
      />
      <button onClick={enviarSolicitacao}>Enviar Solicitação</button>

      {saquesPendentes.length > 0 && (
        <div className="pendente-info">
          <h4>Saque(s) pendente(s):</h4>
          {saquesPendentes.map((item, i) => (
            <p key={i}>R$ {item.valor} • Chave Pix: {item.chavePix}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default Saque;