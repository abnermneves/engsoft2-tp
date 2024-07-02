import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert, expect } from 'chai';
import { Comments } from '/imports/api/collections/comment/comment';
import { Recipes } from '/imports/api/collections/recipe/recipe';
import { Accounts } from 'meteor/accounts-base';
import '/imports/api/collections/recipe/methods.ts';
import '/imports/api/collections/comment/methods.ts';
import '/imports/api/collections/user/methods.ts';

let userId: string;
console.log("Running tests...");
if (Meteor.isServer) {
  describe('Comments', function () {
    before(function() {
      let username = "admin";
      let password = "admin123";
      userId = Meteor.call('user.create',username, password);
    });

    it('comment.create should create a comment successfully', function () {
      const commentId = Meteor.call('comment.create', {
        text: 'Great recipe!',
        rate: 5,
        recipeId: 'recipeId123',
        createdBy: userId
      });
      const comment = Comments.findOne(commentId);
      assert.isNotNull(comment, 'Comment should be created');
      assert.equal(comment?.text, 'Great recipe!');
    });

    it('comment.edit should edit a comment successfully', function () {
      const commentId = Meteor.call('comment.create', {
        text: 'Good recipe!',
        rate: 4,
        recipeId: 'recipeId123',
        createdBy: userId,
      });
      Meteor.call('comment.edit', {
        _id: commentId,
        text: 'Updated comment!',
        recipeId: 'recipeId123',
        createdBy: userId, 
        rate: 3,
      });
      const comment = Comments.findOne(commentId);
      assert.isNotNull(comment, 'Comment should exist after edit');
      assert.equal(comment?.text, 'Updated comment!');
    });

    it('comment.remove should remove a comment successfully', function () {
      const commentId = Meteor.call('comment.create', {
        text: 'Good recipe!',
        rate: 4,
        recipeId: 'recipeId123',
        createdBy: userId,
      });
      Meteor.call('comment.remove', commentId);
      const comment = Comments.findOne(commentId);
      assert.equal(comment, undefined);
    });
  });

  describe('Recipes', function () {
    it('recipe.create should create a recipe successfully', function () {
      const recipeId = Meteor.call('recipe.create', {
        name: 'New Recipe',
        ingredients: [{amount: '1 gm', name: 'ingredient1'}, {amount:'2 units', name:'ingredient2'}],
        steps: ['Mix and cook.'],
        createdBy: userId,
      });
      const recipe = Recipes.findOne(recipeId);
      assert.isNotNull(recipe, 'Recipe should be created');
      assert.equal(recipe?.name, 'New Recipe');
    });

    it('recipe.edit should edit a recipe successfully', function () {
      const recipeId = Meteor.call('recipe.create', {
        name: 'Recipe to Edit',
        ingredients: [{amount: '1 gm', name: 'ingredient1'}, {amount:'2 units', name:'ingredient2'}],
        steps: ['Mix and cook.'],
        createdBy: userId,
      });
      Meteor.call('recipe.edit', {
        _id: recipeId,
        name: 'Edited Recipe',
        ingredients: [{amount: '1 gm', name: 'ingredient1'}, {amount:'2 units', name:'ingredient2'}],
        steps: ['Mix and cook.'],
        createdBy: userId,
      });
      const recipe = Recipes.findOne(recipeId);
      assert.isNotNull(recipe, 'Recipe should exist after edit');
      assert.equal(recipe?.name, 'Edited Recipe');
    });

    it('recipe.remove should remove a recipe successfully', function () {
      const recipeId = Meteor.call('recipe.create', {
        name: 'Recipe to Remove',
        ingredients: [{amount: '1 gm', name: 'ingredient1'}, {amount:'2 units', name:'ingredient2'}],
        steps: ['Mix and cook.'],
        createdBy: userId,
      });
      Meteor.call('recipe.remove', recipeId);
      const recipe = Recipes.findOne(recipeId);
      assert.equal(recipe, undefined);
    });
  });

  describe('Users', function () {
    it('user.create should create a user successfully', function () {
      const userId = Meteor.call('user.create', 'newuser', 'password123');
      const user = Meteor.users.findOne(userId);
      assert.isNotNull(user, 'User should be created');
      assert.equal(user?.username, 'newuser');
    });

    it('user.get should retrieve a user successfully', function () {
      const userId = Meteor.call('user.create', 'userToRetrieve', 'password123');
      const user = Meteor.call('user.get', userId);
      assert.isNotNull(user, 'User should be retrieved');
      assert.equal(user?._id, userId);
    });
  });

}