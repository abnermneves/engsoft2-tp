import { Meteor } from 'meteor/meteor';
import { Recipes } from './collections/recipe';

Meteor.publish('recipes', function() {
    return Recipes.find({});
});
