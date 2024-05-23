import React, { useState } from "react"
import { useNavigate } from 'react-router-dom';

export const LoginForm: React.FC = () => {
    const navigate = useNavigate()
  
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const canSubmit = username && password;

    const handleButtonClick = () => {
        navigate('/posts')
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
        <button>Cadastrar</button>
    </div>;
};
