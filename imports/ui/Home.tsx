import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';

export const Home = () => {

    const navigate = useNavigate();
    
    const user = Meteor.user();
    
    return (
        <div>
            <h1>Home</h1>
            <h2>{user ? "Logado" : "Não Logado"}</h2>
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/register")}>Cadastro</button>
        </div>
    );
};
