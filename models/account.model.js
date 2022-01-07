import db from "../utils/db.js";
import productModel from "./product.model.js";
export default {
    findAll() {
        return db('user');
    },

    async add(entity) {
        const list = [entity];
        return db('user').insert(list);
    },
    async isAvailableUsername(Username){
        const list = await db('user').where('Username', Username).count({quantity: 'Username'});
        if( list[0].quantity == 0){
            return true;
        }else{
            return false;
        };
    },
    async isAvailableEmail(Email){
        const list = await db('user').where('Email', Email).count({quantity: 'Email'});
        if( list[0].quantity == 0){
            return true;
        }else{
            return false;
        };
    },
    async Love(username,productID){
        return db("watchlist").insert({"Username": username, "ProductID": productID})
    },
    async Unlove(username,productID){
        return db("watchlist").where({"Username": username, "ProductID": productID}).del();
    },
    async isLoved(username,productID){
        const entity = {"Username": username, "ProductID": productID}
        const quanity = await productModel.countWatchListbyEntity(entity);
        return quanity===1;
    },

    async findByUsername(username) {
        const list = await db('user').where('Username', username);
        if (list.length === 0)
            return null;
        return list[0];
    },
    delete(id) {
        return db('user').where('Username', id).del();
    },

    async patch(entity) {
        const username = entity.Username;
        entity.Birthday= new Date(entity.Birthday);
        entity.Birthday.setHours(entity.Birthday.getHours()+7);
        entity.Birthday = entity.Birthday.toISOString().slice(0, 19).replace('T', ' ');
        return db('user').update(entity).where('Username', username);
    },

    patchNotBirthday(entity) {
        const id = entity.Username;
        delete entity.Username;

        return db('user').where('Username', id).update(entity);
    },

    getListWantedSeller() {
        return db('user').where('WantedSeller', 1);
    },

    getListSeller() {
        return db('user').where('Type', 3);
    }
}