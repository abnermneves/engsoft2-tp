import React, { useState } from "react"
import { useNavigate } from "react-router-dom";

export const RegisterForm: React.FC = () => {
    const navigate = useNavigate()
  
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const canSubmit = username && password && password === confirmPassword;    

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
        <div>
            <label>Confirmar Senha</label>
            <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
            />
        </div>
        <button disabled={!canSubmit}>Cadastrar</button>
    </div>;
};
