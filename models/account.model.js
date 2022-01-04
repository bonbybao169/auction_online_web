import db from "../utils/db.js";
import userModel from '../models/auth.model.js';

export default {
    findAll() {
        return db('user');
    },

    add(entity) {
        return db('user').insert(entity);
    },

<<<<<<< Updated upstream
    async findByID(id) {
        const list = await db('user').where('Username', id);
        // console.log(list);
=======
    async findByUsername(username) {
        const list = await db('user').where('Username', username);
>>>>>>> Stashed changes
        if (list.length === 0)
            return null;
        return list[0];
    },

<<<<<<< Updated upstream
    delete(id) {
        return db('user').where('Username', id).del();
    },

    patch(entity) {
        const id = entity.Username;
        delete entity.Username;

        return db('user').where('Username', id).update(entity);
    }
=======
    del(id) {
        return db('user')
            .where('id', id)
            .del();
    },

    async patch(entity) {
        const username = entity.Username;
        entity.Birthday= new Date(entity.Birthday);
        entity.Birthday.setHours(entity.Birthday.getHours()+7);
        entity.Birthday = entity.Birthday.toISOString().slice(0, 19).replace('T', ' ');
        console.log(entity);
        return db('user').update(entity).where('Username', username);
    },

>>>>>>> Stashed changes
}