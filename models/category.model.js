import db from "../utils/db.js";

export default {
    findAll() {
        return db('category');
    },

    findParentCat() {
        return db('category').where('ParentID', 'null');
    },

    findChildCat() {
       return db('category').where('ParentID', '<>', 'null');

    }
}