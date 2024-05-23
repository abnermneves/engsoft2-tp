import { Mongo } from 'meteor/mongo';

// Define the Recipe interface
export interface Recipe {
  _id?: string;
  title: string;
  ingredients: string;
  instructions: string;
  createdAt: Date;
}

// Define the Recipes collection
export const Recipes = new Mongo.Collection<Recipe>('recipes');
