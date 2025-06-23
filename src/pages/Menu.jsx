// src/pages/Menu.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import backgroundImage from "../assets/background.jpg";
import backgroundMusic from "../assets/music.mp3";
import "../styles/Menu.css";

function Menu() {
  const [saldo, setSaldo] = useState(0);
  const [uidInicio, setUidInicio] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const user = auth.currentUser;
      if (!user) return navigate("/");

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setSaldo(data.saldo || 0);
        setUidInicio(user.uid.slice(0, 6));
      }
    };

    loadUser();
  }, [navigate]);

  return (
    <div className="menu-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <audio autoPlay loop>
        <source src={backgroundMusic} type="audio/mp3" />
        Seu navegador não suporta áudio.
      </audio>
  
      <div className="menu-overlay">
        <h2>Bem-vindo, Jogador {uidInicio}!</h2>
        <p><strong>Saldo:</strong> R$ {saldo.toFixed(2)}</p>
        <div className="menu-buttons">
        <button onClick={() => navigate("/deposito")}>💰 Depositar</button>

        <button className="botao-saque" onClick={() => navigate("/saque")}>
  💸 Sacar
</button>

        </div>
  
        {/* Lista de mesas */}
        <div className="mesas-scroll">
          {[5, 10, 25, 50, 100, 500].map((valor, i) => (
            <div key={i} className="mesa-card">
              <h3>🎮 Mesa de R$ {valor},00</h3>
              <p>🏆 Prêmio: R$ {(valor * 9).toFixed(2)}</p>
              <button>Entrar</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Menu;
