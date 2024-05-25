import { Meteor } from "meteor/meteor";
import { Comments } from "./comment";

Meteor.publish("comments", function() {
    // Verifica se o usuário está autenticado
    if (!this.userId) {
        return this.ready(); // Encerra a publicação se o usuário não estiver autenticado
    }

    // Retorna um cursor para os documentos encontrados
    return Comments.find({});
});
