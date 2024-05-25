import { Meteor } from 'meteor/meteor';
import { VotingButton }  from './VotingButton';
import React, { useEffect, useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { useNavigate, useParams } from "react-router-dom";
import { Comment, CommentDoc, Comments } from "../../api/collections/comment/comment";
import { GoBack } from "../components/GoBack";
import "./StyleCommentPopup.css";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  recipeId: string | undefined;
  id : string;
}

export const CommentPopup: React.FC<PopupProps> = ({ isOpen, onClose, recipeId, id }) => {

  const navigate = useNavigate();
  const userId = useTracker(() => Meteor.userId());

  const [text, setText] = useState("");
  const [rate, setRate] = useState<number>(-1);
  const [_id, setId] = useState<string>(id);

  const getRate = () => {
    return rate;
  };

  const handleIncrement = () => {
    if (rate < 5) {
      setRate(rate + 1);
    }
  };

  const handleDecrement = () => {
    if (rate > 0) {
      setRate(rate - 1);
    }
  };

  useEffect(() => {
    console.log(id);
    if (id) {
      Meteor.call("comment.getOne", id, (e: Meteor.Error, result: Comment) => {
        if (e) {
          alert(e);
          navigate(-1);
          return;
        }

        setText(result.text);
        setRate(result.rate);
      });
    }
  }, [isOpen]);

  const submit = () => {
    const callback = (e: Meteor.Error, res: any) => {
      if (e) {
        alert(e);
        return;
      }

      alert("Comentário salvo com sucesso.");
      window.location.reload();
    };

    if (id) {
      Meteor.call("comment.edit", {
        _id: id,
        recipeId: recipeId,
        text,
        rate,
        createdBy: userId,
      }, callback);
    } else {
      Meteor.call("comment.create", {
        recipeId: recipeId,
        text,
        rate,
        createdBy: userId,
      }, callback);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
    setText('');
    onClose();
    setRate(-1);
    setId('');
  };

  if (!isOpen) {
    return null;
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <VotingButton handleDecrement={handleDecrement} handleIncrement={handleIncrement} getRate={getRate} />
        <h2>Digite o comentário abaixo:</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            className="comment-input"
          />
          <button type="submit" className="submit-button">Enviar</button>
        </form>
      </div>
    </div>
  );
};
