import { Meteor } from "meteor/meteor";
import { Comments } from "./comment";

Meteor.publish("comments", function() {
    return Comments.find({});
});
