import { Meteor } from "meteor/meteor";
import { Recipe, RecipeDoc, Recipes } from "./recipe";
import { Mongo } from "meteor/mongo";

export const checkRecipeFields = (recipe: Partial<Recipe>) => {
    checkAllowedKeys(recipe);
    checkName(recipe.name);
    checkIngredients(recipe.ingredients);
    checkSteps(recipe.steps);
    checkCreatedBy(recipe.createdBy);
};

export const checkAllowedKeys = (recipe: Partial<Recipe>) => {
    const allowedKeys: (keyof Recipe)[] = ["name", "ingredients", "steps", "createdBy", "numAvaliations", "totalRating"];
    const extraKeys = Object.keys(recipe).filter(key => !allowedKeys.includes(key as keyof Recipe));
    if(extraKeys.length > 0) {
        throw new Meteor.Error("extra-keys", `Recipe contains extra keys: ${extraKeys.join(", ")}`);
    }
};

export const checkName = (name: any) => {
    if(typeof name !== "string" || name.trim() === "") {
        throw new Meteor.Error("invalid-name", "Recipe name must be a non-empty string.");
    }
};

export const checkIngredients = (ingredients: any) => {
    if(!Array.isArray(ingredients) || !ingredients.every(isValidIngredient)) {
        throw new Meteor.Error("invalid-ingredients", "Ingredients must be an array of objects with name and amount properties only.");
    }
};

export const isValidIngredient = (ingredient: any) => {
    const ingredientKeys = Object.keys(ingredient);
    return ingredientKeys.length === 2 && ingredientKeys.includes("name") && ingredientKeys.includes("amount") &&
        typeof ingredient.name === "string" && typeof ingredient.amount === "string";
};

export const checkSteps = (steps: any) => {
    if(!Array.isArray(steps) || !steps.every(step => typeof step === "string")) {
        throw new Meteor.Error("invalid-steps", "Steps must be an array of strings.");
    }
};

export const checkCreatedBy = (createdBy: any) => {
    if (typeof createdBy !== "string" || createdBy.trim() === "") {
        throw new Meteor.Error("invalid-createdBy", "CreatedBy must be a non-empty string.");
    }
};

Meteor.methods({
    "recipe.create": function(recipe?: Partial<Recipe>) {
        if(!recipe) {
            throw new Meteor.Error("invalid-recipe", "Recipe is required.");
        }

        checkRecipeFields(recipe);
        recipe.numAvaliations = 0;
        recipe.totalRating = 0;
        
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
    },
    "recipe.remove": function(id?: string) {
        if(!id) {
            throw new Meteor.Error("invalid-id", "Recipe ID is required.");
        }

        if(typeof id !== "string") {
            throw new Meteor.Error("invalid-id", "Recipe ID must be a string.");
        }

        return Recipes.removeAsync({_id: id, createdBy: this.userId});
    },
    "recipe.changeRating": function(id: string, addAvaliation: number, addRating: number) {
        Meteor.call("recipe.getOne", id, (error: Meteor.Error, result: Recipe) => {
            if(error) {
                console.log(id);
                throw error;
            }

            result.totalRating += addRating;
            result.numAvaliations += addAvaliation;
            Meteor.call("recipe.edit", result, (error: Meteor.Error, result: any) => {
                if(error) {
                    throw error;
                }
            });
        });
    }
});
