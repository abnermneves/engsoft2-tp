import React from "react";
import { useNavigate } from "react-router-dom";
import "./StyleGoBack.css"; // Importando o arquivo de estilos CSS

export const GoBack: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="go-back-container">
            <button className="go-back-button" onClick={() => navigate(-1)}>
                Voltar
            </button>
        </div>
    );
};
