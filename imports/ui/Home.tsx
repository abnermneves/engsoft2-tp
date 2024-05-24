import React from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { useNavigate } from "react-router-dom";
import { RecipeList } from "./recipes/RecipeList";

export const Home = () => {

    const navigate = useNavigate();
    
    const userId = useTracker(() => Meteor.userId());
    
    return (
        <div>
            <RecipeList />
            {userId ? <>
                <button onClick={() => Meteor.logout()}>Deslogar</button>
            </> : <>
                <button onClick={() => navigate("/login")}>Login</button>
                <button onClick={() => navigate("/register")}>Cadastro</button>
            </>}
        </div>
    );
};
