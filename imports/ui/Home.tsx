import React from 'react';
import { Meteor } from 'meteor/meteor';

export const Home = () => {

    const user = Meteor.user();
    
    return (
        <div>
            <h1>Home</h1>
            <h2>{user ? "Logado" : "Não Logado"}</h2>
        </div>
    );
};
