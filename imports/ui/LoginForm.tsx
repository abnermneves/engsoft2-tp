import React, { useState } from "react"
import { useNavigate } from 'react-router-dom';
import { Meteor } from "meteor/meteor";

export const LoginForm: React.FC = () => {
    const navigate = useNavigate()
  
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const canSubmit = username && password;

    const handleButtonClick = () => {
        Meteor.loginWithPassword(username, password, (e) => {
            if(e) {
                alert("Login ou senha inválidos");
                return;
            } 
            
            alert("Logado com sucesso");
            navigate("/");
        });
    };
    

    return <div>
        <div>
            <label>Usuário:</label>
            <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
            />
        </div>
        <div>
            <label>Senha</label>
            <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
        </div>
        <button disabled={!canSubmit} onClick={handleButtonClick}>Logar</button>
        <button onClick={() => navigate('/register')}>Cadastrar</button>
        <button onClick={() => navigate(-1)}>Voltar</button>
    </div>;
};
