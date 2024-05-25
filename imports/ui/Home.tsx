import React from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { useNavigate } from "react-router-dom";
import { RecipeList } from "./recipes/RecipeList";
import './StyleHome.css';  // Importando o CSS

export const Home = () => {

    const navigate = useNavigate();
    
    const userId = useTracker(() => Meteor.userId());
    
    return (
        <div className="home-container">
            <h1>As melhores receitas estão aí:</h1>
            <div className="recipe-list">
                <RecipeList />
            </div>
            {userId ? <>
                <button onClick={() => navigate("/recipe/myRecipes")}>Minhas Receitas</button>
                <button onClick={() => Meteor.logout()}>Deslogar</button>
            </> : <>
                <button onClick={() => navigate("/login")}>Login</button>
                <button onClick={() => navigate("/register")}>Cadastro</button>
            </>}
        </div>
    );
};
