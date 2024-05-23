import React, { useState } from 'react';
import { LoginForm } from './LoginForm';

export const Hello = () => {
    const [counter, setCounter] = useState(0);

    const increment = () => {
        setCounter(counter + 1);
    };

    return (
        <div>
            <LoginForm />
        </div>
    );
};
