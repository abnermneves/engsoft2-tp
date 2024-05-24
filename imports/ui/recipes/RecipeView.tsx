import React, {useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { Recipe, Ingredient } from "/imports/api/collections/recipe/recipe";
import { GoBack } from "../components/GoBack";


export const RecipeView: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [name, setName] = useState("");
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [steps, setSteps] = useState<string[]>([]);

    useEffect(() => {
        if(id) {
            Meteor.call("recipe.getOne", id, (e: Meteor.Error, result: Recipe) => {
                if(e) {
                    alert(e);
                    navigate(-1);
                    return;
                }

                setName(result.name);
                setIngredients(result.ingredients);
                setSteps(result.steps);
            });
        }
    }, []);

    return <div>
        <GoBack/>
        <div>
            <h1>{name}</h1>
        </div>

        <h3>Ingredientes:</h3>
        <ol>
            {ingredients.map((ingredient, idx) => (
                <li key={idx.toString()}>
                    <span>{ingredient.amount}: {ingredient.name}</span>
                </li>
            ))}
        </ol>

        <h3>Modo de preparo</h3>
        <ol>
            {steps.map((step, idx) => (
                <li key={idx.toString()}>
                    <span>{step}</span>
                </li>
            ))}
        </ol>
    </div>;
};
