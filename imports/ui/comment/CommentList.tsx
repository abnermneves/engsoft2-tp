import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { CommentDoc, Comments } from "/imports/api/collections/comment/comment";
import { useNavigate } from "react-router-dom";
import { CommentView } from "./CommentView";
import "./StyleCommentList.css";

export interface ICommentList {
    recipeId?: string;
    handleEdit: (id: string) => void;
}

export const CommentList: React.FC<ICommentList> = ({ recipeId, handleEdit }) => {

    const comments: CommentDoc[] = useTracker(() => {
        const handler = Meteor.subscribe("comments");
        if (!handler.ready()) {
            return [];
        }
        return Comments.find({ recipeId: recipeId }).fetch();
    });

    return (
        <div className="comment-list-container">
            <ol className="comment-list">
                {comments.map(comment => (
                    <div key={comment._id}>
                        <li>
                            <CommentView id={comment._id} handleEdit={handleEdit} />
                        </li>
                    </div>
                ))}
            </ol>
        </div>
    );
};
