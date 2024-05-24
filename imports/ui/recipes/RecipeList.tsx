import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { RecipeDoc, Recipes } from "/imports/api/collections/recipe/recipe";
import { useNavigate } from "react-router-dom";

export const RecipeList: React.FC = () => {

    const navigate = useNavigate();

    const recipes: RecipeDoc[] = useTracker(() => {
        const handler = Meteor.subscribe("recipes");
        if(!handler.ready()) {
            return [];
        }
        return Recipes.find({}).fetch();
    });


    return <div>
        <h1>As melhores receitas estão aí:</h1>
        <ol>
            {recipes.map(recipe => <div
                style={{cursor: "pointer"}}
                onClick={() => navigate(`/recipe/view/${recipe._id}`)}
            >
                <li>
                    {recipe.name}
                </li>
            </div>)}
        </ol>
    </div>;
};
