import { Meteor } from "meteor/meteor";
import { Recipes } from "./recipe";

Meteor.publish("recipes", function() {
    return Recipes.find({});
});
