
import { Meteor } from "meteor/meteor";
import { Recipe, RecipeDoc, Recipes } from "./recipe";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";


const checkRecipeFields = (recipe: Partial<Recipe>) => {
    const allowedKeys: (keyof Recipe)[] = ["name", "ingredients", "steps", "createdBy"];
    const extraKeys = Object.keys(recipe).filter(key => !allowedKeys.includes(key as keyof Recipe));
    if(extraKeys.length > 0) {
        throw new Meteor.Error("extra-keys", `Recipe contains extra keys: ${extraKeys.join(", ")}`);
    }

    const { name, ingredients, steps, createdBy } = recipe;

    if(typeof name !== "string" || name.trim() === "") {
        throw new Meteor.Error("invalid-name", "Recipe name must be a non-empty string.");
    }

    if(!Array.isArray(ingredients) || !ingredients.every(ingredient => {
        const ingredientKeys = Object.keys(ingredient);
        return ingredientKeys.length === 2 && ingredientKeys.includes("name") && ingredientKeys.includes("amount") &&
            typeof ingredient.name === "string" && typeof ingredient.amount === "string";
    })) {
        throw new Meteor.Error("invalid-ingredients", "Ingredients must be an array of objects with name and amount properties only.");
    }

    if(!Array.isArray(steps) || !steps.every(step => typeof step === "string")) {
        throw new Meteor.Error("invalid-steps", "Steps must be an array of strings.");
    }
};


Meteor.methods({
    "recipe.create": function(recipe?: Partial<Recipe>) {
        if(!recipe) {
            throw new Meteor.Error("invalid-recipe", "Recipe is required.");
        }

        checkRecipeFields(recipe);
        
        const userId: string | null = this.userId;
        if(recipe.createdBy !== userId) {
            throw new Meteor.Error("invalid-createdBy", "Created by must match the current logged-in user.");
        }

        return Recipes.insertAsync(recipe as Recipe);
    },
    "recipe.edit": function(recipe?: Partial<RecipeDoc>) {
        if(!recipe) {
            throw new Meteor.Error("invalid-recipe", "Recipe is required.");
        }

        const id = recipe._id;
        if(id && typeof id !== "string") {
            throw new Meteor.Error("invalid-id", "Recipe ID must be a valid string.");
        }


        checkRecipeFields({
            name: recipe.name,
            ingredients: recipe.ingredients,
            steps: recipe.steps,
            createdBy: recipe.createdBy,
        });

        const userId: string | null = this.userId;
        if(recipe.createdBy !== userId) {
            throw new Meteor.Error("invalid-createdBy", "Created by must match the current logged-in user.");
        }

        return Recipes.updateAsync({ _id: recipe._id, createdBy: this.userId } as Mongo.Selector<Recipe>, recipe);
    },
    "recipe.getOne": function(id?: string) {
        
        if(!id) {
            throw new Meteor.Error("invalid-id", "Recipe ID is required.");
        }

        if(typeof id !== "string") {
            throw new Meteor.Error("invalid-id", "Recipe ID must be a string.");
        }
 
        return Recipes.findOneAsync(id);
    }
});