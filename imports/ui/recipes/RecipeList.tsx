import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { RecipeDoc, Recipes, Recipe } from "/imports/api/collections/recipe/recipe";
import { useNavigate } from "react-router-dom";

export interface IRecipeList {
    creator?: string;
}

const calcAvg = (a: Recipe) => {
    return a.numAvaliations == 0 ? -1 : a.totalRating/a.numAvaliations;
}

const sortFunction = (a: Recipe, b: Recipe) => {
    const avgA = calcAvg(a);
    const avgB = calcAvg(b);
    if (avgA < avgB) {
        return 1;
      }
      if (avgA > avgB) {
        return -1;
      }
      return 0;
}

export const RecipeList: React.FC<IRecipeList> = ({creator}) => {

    const navigate = useNavigate();

    const recipes: RecipeDoc[] = useTracker(() => {
        const handler = Meteor.subscribe("recipes");
        if(!handler.ready()) {
            return [];
        }
        return Recipes.find(creator ? {createdBy: creator} : {}).fetch().sort(sortFunction);
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
            {recipes.map(recipe => <div key={recipe._id}><li>
                <span
                    style={{cursor: "pointer"}}
                    onClick={() => navigate(`/recipe/view/${recipe._id}`)}
                >
                    {recipe.name}
                </span>
                <span> - Nota Média: {calcAvg(recipe) == -1 ? '-' : calcAvg(recipe).toString()}</span>
                {creator && <button onClick={() => callRemove(recipe._id)}>Remover</button>}
            </li></div>)}
        </ol>
    </div>;
};
