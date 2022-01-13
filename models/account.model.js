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
    async isCommented(username,productID){
        const entity = {"Username": username, "ProductID": productID}
        const quanity = await productModel.countRatebyEntity(entity);
        return quanity===1;
    },
    async isBlocked(username,productID){
        const entity = {"BidderID": username, "ProductID": productID}
        const list = await db('blockbidder').where(entity).count({quantity: 'ProductID'});
        return list[0].quantity===1;
    },
    async isHighest(username,productID){
        const entity = {"HighestBidder": username, "ID": productID}
        const quanity = await productModel.countProductbyEntity(entity);
        return quanity===1;
    },
    async RateofSb(username){
        const totalrate = await db("rate").where({"RatedPerson": username}).count({quantity: 'ProductID'});
        const positiverate = await db("rate").where({"RatedPerson": username,"Rate": 1}).count({quantity: 'ProductID'});
        if(totalrate[0].quantity==0){
            return false;
        }else{
            return parseFloat(positiverate[0].quantity/totalrate[0].quantity);
        }
    },
    async countRatingbyUsername(username,limit ,offset) {
        const list = await db('rate').where('RatedPerson', username).count({quantity: 'ProductID'});
        return list[0].quantity;
    },
    async findRatingbyUsername(username,limit ,offset) {
        return  await db('rate').where('RatedPerson', username)
            .orderBy('ProductID', 'desc')
            .limit(limit).offset(offset);
    },
    async rateSeller(entity) {
        return await db('rate').insert(entity);
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
        console.log(entity);
        entity.Birthday= new Date(entity.Birthday);
        entity.Birthday.setHours(entity.Birthday.getHours()+7);
        entity.Birthday = entity.Birthday.toISOString().slice(0, 19).replace('T', ' ');
        console.log(entity);
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
    },

    async getEmailByBidderID(BidderID) {
        const list = await db('user').where('Username', BidderID).select('Email');
        // console.log("Email", list[0].Email)
        return list[0].Email;
    },
}