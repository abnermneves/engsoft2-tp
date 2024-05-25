import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import { Meteor } from 'meteor/meteor';
import './StyleRegisterForm.css';

export const RegisterForm: React.FC = () => {
    const navigate = useNavigate();
  
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const canSubmit = username && password && password === confirmPassword;    

    const submit = () => {
        Meteor.call('user.create', username, password, (e: Meteor.Error) => {
            if(e) {
                alert("Não foi possível cadastrar novo usuário. Provavelmente o usuário já foi cadastrado.");
                return;
            }

            Meteor.loginWithPassword(username, password);
            navigate("/");
        });
    };

    return <div className="register-form">
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
        <div>
            <label>Confirmar Senha</label>
            <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
            />
        </div>
        <button disabled={!canSubmit} onClick={submit}>Cadastrar</button>
        <button onClick={() => navigate(-1)}>Voltar</button>
    </div>;
};
