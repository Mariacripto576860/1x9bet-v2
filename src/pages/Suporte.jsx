import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  getDocs,
  collection,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  getDownloadURL,
} from "firebase/storage";

import "../styles/LoginSuporte.css"; // Reutilizando o estilo

function Suporte() {
  const [pendentesDeposito, setPendentesDeposito] = useState([]);
  const [pendentesSaque, setPendentesSaque] = useState([]);

  useEffect(() => {
    buscarPendentes();
  }, []);

  const buscarPendentes = async () => {
    const listaDepositos = [];
    const listaSaques = [];

    // 📥 Busca depósitos pendentes na coleção separada
    const depositoSnapshot = await getDocs(collection(db, "depositosPendentes"));
    depositoSnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.status === "pendente") {
        listaDepositos.push({ id: docSnap.id, ...data });
      }
    });

    // 📤 Busca saques pendentes dentro da coleção users
    const usuariosSnapshot = await getDocs(collection(db, "users"));
    for (const userDoc of usuariosSnapshot.docs) {
      const userId = userDoc.id;
      const userData = userDoc.data();

      if (Array.isArray(userData.saque)) {
        userData.saque.forEach((saq, index) => {
          if (!saq.aprovado) {
            listaSaques.push({ ...saq, userId, index });
          }
        });
      }
    }

    setPendentesDeposito(listaDepositos);
    setPendentesSaque(listaSaques);
  };

  const aprovarDeposito = async (item) => {
    const userRef = doc(db, "users", item.uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();

    // ✅ Atualiza o saldo
    await updateDoc(userRef, {
      saldo: (userData.saldo || 0) + item.valor,
    });

    // ✅ Atualiza o status do comprovante
    await updateDoc(doc(db, "depositosPendentes", item.id), {
      status: "aprovado",
    });

    alert(`Depósito de R$${item.valor} aprovado`);
    buscarPendentes();
  };

  const aprovarSaque = async (item) => {
    const userRef = doc(db, "users", item.userId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();

    const novosSaques = [...userData.saque];
    novosSaques[item.index].aprovado = true;

    await updateDoc(userRef, {
      saque: novosSaques,
    });

    alert(`Saque de R$${item.valor} marcado como aprovado`);
    buscarPendentes();
  };

  const abrirComprovante = async (nomeArquivo) => {
    try {
      const storage = getStorage();
      const arquivoRef = ref(storage, `comprovantes/${nomeArquivo}`);
      const url = await getDownloadURL(arquivoRef);
      window.open(url, "_blank");
    } catch (error) {
      alert("Erro ao abrir comprovante: " + error.message);
    }
  };

  return (
    <div className="login-suporte-container">
      <h2>Painel de Suporte</h2>

      <h3>Depósitos Pendentes</h3>
      {pendentesDeposito.length === 0 ? (
        <p>Nenhum depósito pendente</p>
      ) : (
        pendentesDeposito.map((item, i) => (
          <div key={i} className="item-pendente">
            <p>UID: {item.uid}</p>
            <p>Valor: R${item.valor}</p>
            <p>Arquivo: {item.nomeArquivo}</p>
            <button onClick={() => abrirComprovante(item.nomeArquivo)}>
              Abrir Comprovante
            </button>
            <button onClick={() => aprovarDeposito(item)}>
              Aprovar Depósito
            </button>
          </div>
        ))
      )}

      <h3>Saques Pendentes</h3>
      {pendentesSaque.length === 0 ? (
        <p>Nenhum saque pendente</p>
      ) : (
        pendentesSaque.map((item, i) => (
          <div key={i} className="item-pendente">
            <p>Usuário: {item.userId}</p>
            <p>Valor: R${item.valor}</p>
            <p>Chave PIX: {item.chavePix}</p>
            <button onClick={() => aprovarSaque(item)}>
              Marcar como aprovado
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Suporte;