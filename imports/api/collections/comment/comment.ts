import { Mongo } from 'meteor/mongo';

export interface Comment {
    text: string,
    rate: number,
    recipeId: string,
    createdBy: string
}

export interface CommentDoc extends Comment {
    _id: string,
}

export const Comments = new Mongo.Collection<Comment>('comments');
