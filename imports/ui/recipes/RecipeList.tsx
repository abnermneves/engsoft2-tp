import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { RecipeDoc, Recipes } from "/imports/api/collections/recipe/recipe";
import { useNavigate } from "react-router-dom";

export interface IRecipeList {
    creator?: string;
}

export const RecipeList: React.FC<IRecipeList> = ({creator}) => {

    const navigate = useNavigate();

    const recipes: RecipeDoc[] = useTracker(() => {
        const handler = Meteor.subscribe("recipes");
        if(!handler.ready()) {
            return [];
        }
        return Recipes.find(creator ? {createdBy: creator} : {}).fetch();
    });


    return <div>
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
