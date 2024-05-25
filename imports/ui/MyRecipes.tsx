import React, { useEffect } from "react";
import { GoBack } from "./components/GoBack";
import { useTracker } from "meteor/react-meteor-data";
import { useNavigate } from "react-router-dom";
import { RecipeList } from "./recipes/RecipeList";
import { Meteor } from "meteor/meteor";
import './StyleMyRecipes.css';

export const MyRecipes: React.FC = () => {
    const navigate = useNavigate();
    const userId: string | null = useTracker(() => Meteor.userId());

    useEffect(() => {
        if(!userId) {
            alert("Você deve estar logado para criar uma receita");
            navigate("/");
        }
    }, []);

    return <div className="my-recipes">
        <GoBack />
        <h1>Suas receitas:</h1>
        <RecipeList creator={userId || ""} />
        <button onClick={() => navigate("/recipe/edit")}>Criar receita</button>
    </div>;
};
