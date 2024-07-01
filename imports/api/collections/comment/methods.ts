
import { Meteor } from "meteor/meteor";
import { Comment, CommentDoc, Comments } from "./comment";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";


const callback = (e: Meteor.Error, res: any) => {
    throw e;
};

export const checkCommentFields = (comment: Partial<Comment>) => {
    const allowedKeys: (keyof Comment)[] = ["text", "rate", "recipeId", "createdBy"];
    const extraKeys = Object.keys(comment).filter(key => !allowedKeys.includes(key as keyof Comment));
    if(extraKeys.length > 0) {
        throw new Meteor.Error("extra-keys", `Comment contains extra keys: ${extraKeys.join(", ")}`);
    }

    const { text, rate, recipeId, createdBy } = comment;

    if(typeof text !== "string" || text.trim() === "") {
        throw new Meteor.Error("invalid-text", "Comment text must be a non-empty string.");
    }

    if(typeof rate !== "number" || rate === -1) {
        throw new Meteor.Error("invalid-rate", "You must rate the recipe.");
    }

    if(typeof recipeId !== "string" || recipeId.trim() === "") {
        throw new Meteor.Error("invalid-recipeId", "Comment must be assigned to a recipe.");
    }

    if (typeof createdBy !== "string" || createdBy.trim() === "") {
        throw new Meteor.Error("invalid-createdBy", "CreatedBy must be a non-empty string.");
    }
};


Meteor.methods({
    "comment.create": function(comment?: Partial<Comment>) {

        if(!comment) {
            throw new Meteor.Error("invalid-comment", "Comment is required.");
        }

        checkCommentFields(comment);
        
        const userId: string | null = this.userId;
        if(comment.createdBy !== userId) {
            throw new Meteor.Error("invalid-createdBy", "Created by must match the current logged-in user.");
        }

        Meteor.call("recipe.changeRating", comment.recipeId, 1, comment.rate, callback);

        return Comments.insertAsync(comment as Comment);
    },
    "comment.edit": function(comment?: Partial<CommentDoc>) {
        if(!comment) {
            throw new Meteor.Error("invalid-comment", "Comment is required.");
        }

        const id = comment._id;
        if(id && typeof id !== "string") {
            throw new Meteor.Error("invalid-id", "Comment ID must be a valid string.");
        }

        
        checkCommentFields({
            text: comment.text,
            rate: comment.rate,
            recipeId: comment.recipeId,
            createdBy: comment.createdBy,
        });

        const userId: string | null = this.userId;
        if(comment.createdBy !== userId) {
            throw new Meteor.Error("invalid-createdBy", "Created by must match the current logged-in user.");
        }

        Meteor.call("recipe.changeRating", comment.recipeId,0, comment.rate, callback);
        
        Meteor.call("comment.getOne", id, (e: Meteor.Error, res: Comment) => {
            console.log(res.rate);
            Meteor.call("recipe.changeRating", comment.recipeId, 0, -res.rate, callback);
        });

        return Comments.updateAsync({ _id: comment._id, createdBy: this.userId } as Mongo.Selector<Comment>, comment);
    },
    "comment.getOne": function(id? : string) {
        
        if(!id) {
            throw new Meteor.Error("invalid-id", "Comment ID is required.");
        }

        if(typeof id !== "string") {
            throw new Meteor.Error("invalid-id", "Comment ID must be a string.");
        }
 
        return Comments.findOneAsync(id);
    },
    "comment.remove": function(id?: string) {
        if(!id) {
            throw new Meteor.Error("invalid-id", "Comment ID is required.");
        }

        if(typeof id !== "string") {
            throw new Meteor.Error("invalid-id", "Comment ID must be a string.");
        }

        Meteor.call("comment.getOne", id, (e: Meteor.Error, res: Comment) => {
            Meteor.call("recipe.changeRating", res.recipeId, -1, -res.rate, callback);
        });

        return Comments.removeAsync({_id: id, createdBy: this.userId});
    }
});