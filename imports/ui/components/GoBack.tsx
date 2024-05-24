import React from "react";
import { useNavigate } from "react-router-dom";

export const GoBack: React.FC = () => {
    const navigate = useNavigate();
    return <div>
        <button onClick={() => navigate(-1)}>
            Voltar
        </button>
    </div>;
};
