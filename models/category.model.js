import db from "../utils/db.js";

export default {
    findAll() {
        return db('category');
    },

    findParentCat() {
        return db('category').where('ParentID', null);
    },

    findChildCat() {
       return db('category').where('ParentID', '<>', null);

    },

    add(entity) {
        return db('category').insert(entity);
    },

    async findByID(id) {
        const list = await db('category').where('CategoryID', id);
        console.log(list);
        if (list.length === 0)
            return null;

        return list[0];
    },

    delete(id) {
        return db('category').where('CategoryID', id).del();
    },

    patch(entity) {
        const id = entity.CategoryID;
        delete entity.CategoryID;

        return db('category').where('CategoryID', id).update(entity);
    }
}