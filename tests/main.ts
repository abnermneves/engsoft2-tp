import { Meteor } from 'meteor/meteor';
import { checkCommentFields } from '/imports/api/collections/comment/methods';
import { checkRecipeFields, checkAllowedKeys, checkCreatedBy, checkIngredients, checkName, checkSteps } from '/imports/api/collections/recipe/methods';
import assert from 'assert';


describe('engsoft2-tp', function() {
    it('should pass for a valid comment', function() {
        const validComment = {
          text: 'Great recipe!',
          rate: 5,
          recipeId: 'recipe123',
          createdBy: 'user456'
        };
        assert.doesNotThrow(() => checkCommentFields(validComment));
    });

    it('should throw an error for extra keys', function() {
        const invalidComment = {
            text: 'Great recipe!',
            rate: 5,
            recipeId: 'recipe123',
            createdBy: 'user456',
            extraKey: 'extra'
        };

        assert.throws(() => checkCommentFields(invalidComment), Meteor.Error, 'Comment contains extra keys: extraKey');
    });

    it('should throw an error for invalid text', function() {
        const invalidComment = {
            text: '',
            rate: 5,
            recipeId: 'recipe123',
            createdBy: 'user456'
        };

        assert.throws(() => checkCommentFields(invalidComment), Meteor.Error, 'Comment text must be a non-empty string.');
    });

    it('should throw an error for invalid rate', function() {
        const invalidComment = {
            text: 'Great recipe!',
            rate: -1,
            recipeId: 'recipe123',
            createdBy: 'user456'
        };

        assert.throws(() => checkCommentFields(invalidComment), Meteor.Error, 'You must rate the recipe.');
    });

    it('should throw an error for invalid recipeId', function() {
        const invalidComment = {
            text: 'Great recipe!',
            rate: 5,
            recipeId: '',
            createdBy: 'user456'
        };

        assert.throws(() => checkCommentFields(invalidComment), Meteor.Error, 'Comment must be assigned to a recipe.');
    });

    it('should throw an error for invalid createdBy', function() {
        const invalidComment = {
            text: 'Great recipe!',
            rate: 5,
            recipeId: 'recipe123',
            createdBy: ''
        };

        assert.throws(() => checkCommentFields(invalidComment), Meteor.Error, 'CreatedBy must be a non-empty string.');
    });

    describe('checkAllowedKeys', function() {
        it('should pass for allowed keys', function() {
            const recipe = { name: 'Cake', ingredients: [], steps: [], createdBy: 'chef', numAvaliations: 0, totalRating: 0 };
            assert.doesNotThrow(() => checkAllowedKeys(recipe));
        });
      
        it('should throw an error for extra keys', function() {
            const recipe = { name: 'Cake', ingredients: [], steps: [], createdBy: 'chef', numAvaliations: 0, totalRating: 0, extraKey: 'extra' };
            assert.throws(() => checkAllowedKeys(recipe), Meteor.Error, 'Recipe contains extra keys: extraKey');
        });
    });
      
    describe('checkName', function() {
        it('should pass for valid name', function() {
             assert.doesNotThrow(() => checkName('Chocolate Cake'));
        });
      
        it('should throw an error for empty name', function() {
             assert.throws(() => checkName(''), Meteor.Error, 'Recipe name must be a non-empty string.');
        });
      
        it('should throw an error for non-string name', function() {
            assert.throws(() => checkName(123), Meteor.Error, 'Recipe name must be a non-empty string.');
        });
    });
      
    describe('checkIngredients', function() {
        it('should pass for valid ingredients', function() {
            const ingredients = [{ name: 'Flour', amount: '2 cups' }, { name: 'Sugar', amount: '1 cup' }];
            assert.doesNotThrow(() => checkIngredients(ingredients));
        });
      
        it('should throw an error for invalid ingredients structure', function() {
            const ingredients = [{ name: 'Flour' }];  // Missing amount
            assert.throws(() => checkIngredients(ingredients), Meteor.Error, 'Ingredients must be an array of objects with name and amount properties only.');
        });
      
        it('should throw an error for non-array ingredients', function() {
             assert.throws(() => checkIngredients('Flour'), Meteor.Error, 'Ingredients must be an array of objects with name and amount properties only.');
        });
    });
      
    describe('checkSteps', function() {
        it('should pass for valid steps', function() {
            const steps = ['Mix ingredients', 'Bake at 350°F for 30 minutes'];
            assert.doesNotThrow(() => checkSteps(steps));
        });
      
        it('should throw an error for non-array steps', function() {
            assert.throws(() => checkSteps('Mix ingredients'), Meteor.Error, 'Steps must be an array of strings.');
        });
      
        it('should throw an error for invalid step structure', function() {
            const steps = ['Mix ingredients', 123];  // Non-string step
            assert.throws(() => checkSteps(steps), Meteor.Error, 'Steps must be an array of strings.');
        });
    });
      
    describe('checkCreatedBy', function() {
        it('should pass for valid createdBy', function() {
            assert.doesNotThrow(() => checkCreatedBy('chef123'));
        });
      
        it('should throw an error for empty createdBy', function() {
            assert.throws(() => checkCreatedBy(''), Meteor.Error, 'CreatedBy must be a non-empty string.');
        });
      
        it('should throw an error for non-string createdBy', function() {
            assert.throws(() => checkCreatedBy(123), Meteor.Error, 'CreatedBy must be a non-empty string.');
        });
    });

    it('should pass for a valid recipe', function() {
        const validRecipe = {
            name: 'Chocolate Cake',
            ingredients: [
                { name: 'Flour', amount: '2 cups' },
                { name: 'Sugar', amount: '1 cup' },
                { name: 'Cocoa Powder', amount: '1/2 cup' }
            ],
            steps: ['Mix ingredients', 'Bake at 350°F for 30 minutes'],
            createdBy: 'chef123',
            numAvaliations: 10,
            totalRating: 50
        };
        assert.doesNotThrow(() => checkRecipeFields(validRecipe));
    });
    
    it('should throw an error for extra keys', function() {
        const invalidRecipe = {
            name: 'Chocolate Cake',
            ingredients: [
                { name: 'Flour', amount: '2 cups' },
                { name: 'Sugar', amount: '1 cup' },
                { name: 'Cocoa Powder', amount: '1/2 cup' }
            ],
            steps: ['Mix ingredients', 'Bake at 350°F for 30 minutes'],
            createdBy: 'chef123',
            numAvaliations: 10,
            totalRating: 50,
            extraKey: 'extra'
        };
        assert.throws(() => checkRecipeFields(invalidRecipe), Meteor.Error, 'Recipe contains extra keys: extraKey');
    });
    
    it('should throw an error for invalid name', function() {
        const invalidRecipe = {
            name: '',
            ingredients: [
                { name: 'Flour', amount: '2 cups' },
                { name: 'Sugar', amount: '1 cup' },
                { name: 'Cocoa Powder', amount: '1/2 cup' }
            ],
            steps: ['Mix ingredients', 'Bake at 350°F for 30 minutes'],
            createdBy: 'chef123',
            numAvaliations: 10,
            totalRating: 50
        };

        assert.throws(() => checkRecipeFields(invalidRecipe), Meteor.Error, 'Recipe name must be a non-empty string.');
    });
    
    it('should throw an error for invalid ingredients', function() {
        const invalidRecipe = {
            name: 'Chocolate Cake',
            ingredients: [
                { name: 'Flour', amount: '2 cups' },
                { name: 'Sugar' }  // Missing amount
            ],
            steps: ['Mix ingredients', 'Bake at 350°F for 30 minutes'],
            createdBy: 'chef123',
            numAvaliations: 10,
            totalRating: 50
        };
    
        // @ts-ignore
        assert.throws(() => checkRecipeFields(invalidRecipe), Meteor.Error, 'Ingredients must be an array of objects with name and amount properties only.');
    });
    
    it('should throw an error for invalid steps', function() {
        const invalidRecipe = {
            name: 'Chocolate Cake',
            ingredients: [
                { name: 'Flour', amount: '2 cups' },
                { name: 'Sugar', amount: '1 cup' }
            ],
            steps: 'Mix ingredients',  // Should be an array
            createdBy: 'chef123',
            numAvaliations: 10,
            totalRating: 50
        };
        // @ts-ignore
        assert.throws(() => checkRecipeFields(invalidRecipe), Meteor.Error, 'Steps must be an array of strings.');
    });
    
    it('should throw an error for invalid createdBy', function() {
        const invalidRecipe = {
            name: 'Chocolate Cake',
            ingredients: [
                { name: 'Flour', amount: '2 cups' },
                { name: 'Sugar', amount: '1 cup' }
            ],
            steps: ['Mix ingredients', 'Bake at 350°F for 30 minutes'],
            createdBy: '',  // Empty string
            numAvaliations: 10,
            totalRating: 50
        };
    
        assert.throws(() => checkRecipeFields(invalidRecipe), Meteor.Error, 'CreatedBy must be a non-empty string.');
    });
    
    it('should not throw an error for missing numAvaliations', function() {
        const invalidRecipe = {
            name: 'Chocolate Cake',
            ingredients: [
                { name: 'Flour', amount: '2 cups' },
                { name: 'Sugar', amount: '1 cup' }
            ],
            steps: ['Mix ingredients', 'Bake at 350°F for 30 minutes'],
            createdBy: 'chef123',
            totalRating: 50,
        };
    
        assert.doesNotThrow(() => checkRecipeFields(invalidRecipe));
    });
    
    it('should not throw an error for missing totalRating', function() {
        const invalidRecipe = {
            name: 'Chocolate Cake',
            ingredients: [
                { name: 'Flour', amount: '2 cups' },
                { name: 'Sugar', amount: '1 cup' }
            ],
            steps: ['Mix ingredients', 'Bake at 350°F for 30 minutes'],
            createdBy: 'chef123',
            numAvaliations: 10,
        };
    
        assert.doesNotThrow(() => checkRecipeFields(invalidRecipe));
    });
});
