import db from "../utils/db.js";

export default {
    findAll() {
        return db('user');
    },

    add(entity) {
        return db('user').insert(entity);
    },

    async findByID(id) {
        const list = await db('user').where('Username', id);
        // console.log(list);
        if (list.length === 0)
            return null;

        return list[0];
    },

    delete(id) {
        return db('user').where('Username', id).del();
    },

    patch(entity) {
        const id = entity.Username;
        delete entity.Username;

        return db('user').where('Username', id).update(entity);
    }
}