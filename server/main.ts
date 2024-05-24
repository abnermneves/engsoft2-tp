import { Meteor } from "meteor/meteor";
import "/imports/api/collections/user/methods";
import "/imports/api/collections/recipe/methods";
import "/imports/api/collections/recipe/publications";
import "/imports/api/collections/comment/methods";
import "/imports/api/collections/comment/publications";

Meteor.startup(async () => {
    // Inicio
});
