import db from "../utils/db.js";

export default {
    findAll() {
        return db('user');
    },

    add(entity) {
        return db('user').insert(entity);
    },

    async findByID(id) {
        const list = await db('category').where('CategoryID', id);
        console.log(list);
        if (list.length === 0)
            return null;

        return list[0];
    },

    async delete(id) {
        const list = await db('product').where('Category', id);
        const listParent = await this.findByParentID(id);
        console.log("listP:", listParent);

        if (list.length === 0 && listParent.length === 0) {
            return db('category').where('CategoryID', id).del();
        } else {
            return null;
        }
    },

    patch(entity) {
        const id = entity.CategoryID;
        delete entity.CategoryID;

        return db('category').where('CategoryID', id).update(entity);
    }
}