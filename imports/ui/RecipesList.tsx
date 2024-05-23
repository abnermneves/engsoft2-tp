import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { Recipe, Recipes } from '../api/collections/recipe';

const RecipesList: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    useEffect(() => {
        // Subscribe to the recipes collection and update the state
        const subscription = Meteor.subscribe('recipes');
        const recipeData = Recipes.find({}, { sort: { createdAt: -1 } }).fetch();
        const recipes: Recipe[] = recipeData.map((doc) => ({
            _id: doc._id,
            title: doc.title,
            ingredients: doc.ingredients,
            instructions: doc.instructions,
            createdAt: doc.createdAt,
        }));
        setRecipes(recipes);

        // Clean up the subscription when the component is unmounted
        return () => {
            subscription.stop();
        };
    }, []);

    return (
        <div>
        <h2>Recipes</h2>
        <ul>
            {recipes.map((recipe) => (<li key={recipe._id}>
                <h3>{recipe.title}</h3>
                <p>Ingredients: {recipe.ingredients}</p>
                <p>Instructions: {recipe.instructions}</p>
                <p>Created at: {recipe.createdAt.toLocaleString()}</p>
            </li>))}
        </ul>
        </div>
    );
};

export default RecipesList;
