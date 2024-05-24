import React, {useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { Recipe, Ingredient } from "/imports/api/collections/recipe/recipe";
import { GoBack } from "../components/GoBack";
import { useTracker } from "meteor/react-meteor-data";
import { CommentPopup }  from "../comment/CommentPopup";
import { CommentList } from "../comment/CommentList";


export const RecipeView: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [cmtId, setCmtId] = useState<string>("");

    const [name, setName] = useState("");
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [steps, setSteps] = useState<string[]>([]);
    const [createdBy, setCreatedBy] = useState("");
    const [avgRate, setAvgRate] = useState<string>("-");

    const user = useTracker(() => Meteor.user());

    const handleEdit = (id: string) => {
        setCmtId(id);
        handleOpenPopup();
    }; 


    // Comment popup
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [value, setValue] = useState('');

    const handleOpenPopup = () => {
        if(!user)
            navigate(`/login`);
        else
            setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setCmtId('');
        setIsPopupOpen(false);
    };

    useEffect(() => {
        if(id) {
            Meteor.call("recipe.getOne", id, async (e: Meteor.Error, result: Recipe) => {
                if(e) {
                    alert(e);
                    navigate(-1);
                    return;
                }

                setName(result.name);
                setIngredients(result.ingredients);
                setSteps(result.steps);
                setAvgRate(result.numAvaliations == 0 ? "-" : (result.totalRating/result.numAvaliations).toString());

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
        <GoBack/>
        <div>
            <h1>{name}</h1>
            <h2>Nota média: {avgRate}</h2>
        </div>

        <h3>Ingredientes:</h3>
        <ol>
            {ingredients.map((ingredient, idx) => (
                <li key={idx.toString()}>
                    <span>{ingredient.amount}: {ingredient.name}</span>
                </li>
            ))}
        </ol>

        <h3>Modo de preparo</h3>
        <ol>
            {steps.map((step, idx) => (
                <li key={idx.toString()}>
                    <span>{step}</span>
                </li>
            ))}
        </ol>

        {createdBy === user?.username ? 
            <>
                <p>Criada por você!</p>
                <button onClick={() => navigate(`/recipe/edit/${id}`)}>Editar</button>
            </> :
            <p>Criada por {createdBy}</p>
        }
        <button onClick={handleOpenPopup}>Escrever comentário</button>
        <CommentPopup isOpen={isPopupOpen} onClose={handleClosePopup} recipeId={id} id={cmtId}/>
        <CommentList recipeId={id} handleEdit={handleEdit}/>
    </div>;
};
