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

    const callRemove = (id: string) => {
        Meteor.call("recipe.remove", id, (e: Meteor.Error, r: any) => {
            if(e) {
                alert(e);
                return;
            }

            if(r !== 1) {
                alert("Não foi possível remover");
                return;
            }
        });
    };

    return <div>
        <ol>
            {recipes.map(recipe => <><div><li>
                <span
                    style={{cursor: "pointer"}}
                    onClick={() => navigate(`/recipe/view/${recipe._id}`)}
                >
                    {recipe.name}
                </span>
                {creator && <button onClick={() => callRemove(recipe._id)}>Remover</button>}
            </li></div></>)}
        </ol>
    </div>;
};
