import React, {useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { Comment, CommentDoc, Comments } from "/imports/api/collections/comment/comment";
import { GoBack } from "../components/GoBack";
import { useTracker } from "meteor/react-meteor-data";


interface CommentViewProps{
    id: string;
    handleEdit: (id: string) => void;
}

export const CommentView: React.FC<CommentViewProps> = ({id, handleEdit}) => {
    const navigate = useNavigate();

    const [text, setText] = useState("");
    const [rate, setRate] = useState<number>(-1);
    const [createdBy, setCreatedBy] = useState<string>("");


    const user = useTracker(() => Meteor.user());

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

    useEffect(() => {
        if(id) {
            Meteor.call("comment.getOne", id, async (e: Meteor.Error, result: Comment) => {
                if(e) {
                    alert(e);
                    navigate(-1);
                    return;
                }

                setText(result.text);
                setRate(result.rate);

                Meteor.call('user.get', result.createdBy, (e: Meteor.Error, r: any) => {
                    if(e) {
                        alert("Falha ao obter criador");
                        return;
                    }          
                    
                    setCreatedBy(r.username); 
                });
            });
        }
    }, []);

    return <div>
        <div>
            <h4>Nota: {rate}</h4>
            <h4>Comentário de {createdBy}:</h4>
        </div>


        <span>{text}</span>

        {createdBy === user?.username ? 
            <>
                <button onClick={() => handleEdit(id)}>Editar</button>
                <button onClick={() => callRemove(id)}>Remover</button>
            </> :
            <></>
        }
    </div>;
};
