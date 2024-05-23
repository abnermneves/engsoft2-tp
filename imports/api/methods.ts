import { Meteor } from 'meteor/meteor';
import { Recipes,Recipe } from './collections/recipe';

Meteor.methods({
    'recipes.insert'(recipe: Recipe) {
        Recipes.insert(recipe);
    },

    'recipes.update'(_id: string, updates: Partial<Recipe>) {
        Recipes.update(_id, { $set: updates });
    },

    'recipes.remove'(_id: string) {
        Recipes.remove(_id);
    },
});
