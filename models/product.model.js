import db from "../utils/db.js";

export default {
    findAll() {
        return db('product');
    },

    findByCatID(catID) {
        return db('product').where('Category', catID);
    }
}