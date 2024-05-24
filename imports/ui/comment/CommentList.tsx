import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { CommentDoc, Comments } from "/imports/api/collections/comment/comment";
import { useNavigate } from "react-router-dom";
import { CommentView } from "./CommentView";

export interface ICommentList {
    recipeId?: string;
}

export const CommentList: React.FC<ICommentList> = ({recipeId}) => {

    const navigate = useNavigate();

    const comments: CommentDoc[] = useTracker(() => {
        const handler = Meteor.subscribe("comments");
        if(!handler.ready()) {
            return [];
        }
        console.log(Comments.find({recipeId: recipeId}).fetch());
        return Comments.find({recipeId: recipeId}).fetch();
    });

    const callRemove = (id: string) => {
        Meteor.call("comment.remove", id, (e: Meteor.Error, r: any) => {
            if(e) {
                alert(e);
                return;
            }

            if(r !== 1) {
                alert("Não foi possível remover");
                return;
            }
        });
    };

    return <div>
        <ol>
            {comments.map(comment => <div key={comment._id}><li>
                <CommentView id={comment._id}></CommentView>
               {/*  {creator && <button onClick={() => callRemove(comment._id)}>Remover</button>} */}
            </li></div>)}
        </ol>
    </div>;
};
