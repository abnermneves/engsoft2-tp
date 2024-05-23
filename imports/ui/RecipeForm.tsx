import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { v4 as uuidv4 } from 'uuid';

const RecipeForm: React.FC = () => {
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const recipeId = uuidv4();

        const recipe = {
            _id: recipeId,
            title,
            ingredients,
            instructions,
            createdAt: new Date(),
        };

        Meteor.call('recipes.insert', recipe, (error: Meteor.Error) => {
            if (error) {
                console.error(error);
            } else {
                setTitle('');
                setIngredients('');
                setInstructions('');
            }
        });

        setTitle('');
        setIngredients('');
        setInstructions('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="ingredients">Ingredients:</label>
                <textarea
                    id="ingredients"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="instructions">Instructions:</label>
                <textarea
                    id="instructions"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Save Recipe</button>
        </form>
    );
};

export default RecipeForm;