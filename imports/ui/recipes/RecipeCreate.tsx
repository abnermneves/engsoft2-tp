import React, { useEffect, useRef, useState } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { useNavigate } from "react-router-dom";
import { Ingredient, Recipe } from "../../api/collections/recipe/recipe";

export const RecipeCreate: React.FC = () => {
    const navigate = useNavigate();
    const userId = useTracker(() => Meteor.userId());

    useEffect(() => {
        if(!userId) {
            alert("Você deve estar logado para criar uma receita");
            navigate("/");
        }
    }, []);


    const [name, setName] = useState('');
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [steps, setSteps] = useState<string[]>([]);

    const submit = () => {
        Meteor.call('recipe.create', {
            name, ingredients, steps,
            createdBy: userId,
        }, (e: Meteor.Error) => {
            console.log(e);
            if(e) {
                console.error(e);
                alert("Não foi possível salvar a receita");
                return;
            }

            alert("Receita salva com sucesso.");
            navigate(-1);
        });
    };

    return <div>
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