import React, { useEffect, useState } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { useNavigate, useParams } from "react-router-dom";
import { Ingredient, Recipe } from "../../api/collections/recipe/recipe";
import { GoBack } from "../components/GoBack";

export const RecipeEdit: React.FC = () => {
    const navigate = useNavigate();
    const userId = useTracker(() => Meteor.userId());
    const { id } = useParams();

    useEffect(() => {
        if(!userId) {
            alert("Você deve estar logado para criar uma receita");
            navigate("/");
        }
    }, []);


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

    const submit = () => {
        const callback = (e: Meteor.Error, res: any) => {
            if(e) {
                alert(e);
                return;
            }

            if(res !== 1) {
                alert("Não foi possível salvar.");
                return;
            }

            alert("Receita salva com sucesso.");
            navigate(-1);
        };

        if(id) {
            Meteor.call("recipe.edit", {
                _id: id,
                name, ingredients, steps,
                createdBy: userId,
            }, callback);
        } else {
            Meteor.call("recipe.create", {
                name, ingredients, steps,
                createdBy: userId,
            }, callback);
        }
    };

    return <div>
        <GoBack/>
        
        <div>
            <label>Nome:</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}/>
        </div>

        <h3>Ingredientes:</h3>
        {ingredients.map((ingredient, idx) => <div key={idx.toString()}>
            <label>Quantidade:</label>
            <input type="text" value={ingredient.amount} onChange={e => {
                let newIngredients = [...ingredients];
                newIngredients[idx].amount = e.target.value;
                setIngredients(newIngredients);
            }} />
            <label>Ingrediente:</label>
            <input type="text" value={ingredient.name} onChange={e => {
                let newIngredients = [...ingredients];
                newIngredients[idx].name = e.target.value;
                setIngredients(newIngredients);
            }}/>
            <button onClick={() => {
                let newIngredients = [...ingredients];
                newIngredients.splice(idx, 1);
                setIngredients(newIngredients);
            }}>Remover</button>
        </div>)}

        <div>
            <button onClick={() => {
                const newIngredients = [...ingredients, {name: '', amount: ''}];
                setIngredients(newIngredients);
            }}>Adicionar Ingrediente</button>
        </div>


        <h3>Modo de preparo</h3>
        {steps.map((step, idx) => <div key={idx.toString()}>
            <label>Passo {idx + 1}:</label>
            <input type="text" value={step} onChange={e => {
                let newSteps = [...steps];
                newSteps[idx] = e.target.value;
                setSteps(newSteps);
            }}/>
            <button onClick={() => {
                let newSteps = [...steps];
                newSteps.splice(idx, 1);
                setSteps(newSteps);
            }}>Remover</button>
        </div>)}

        <div>
            <button onClick={() => {
                const newSteps = [...steps, ''];
                setSteps(newSteps);
            }}>Adicionar passo</button>
        </div>

        <div>
            <button onClick={submit}>Salvar</button>
            <button onClick={() => navigate(-1)}>Cancelar</button>
        </div>
    </div>;
};