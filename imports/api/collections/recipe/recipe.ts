import { Mongo } from 'meteor/mongo';

export interface Ingredient {
    name: string,
    amount: string,
}

export interface Recipe {
    name: string;
    ingredients: Ingredient[],
    steps: string[],
    createdBy: string,
    numAvaliations: number,
    totalRating: number,
}

export interface RecipeDoc extends Recipe {
    _id: string,
}

export const Recipes = new Mongo.Collection<Recipe>('recipes');
