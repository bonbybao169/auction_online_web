import db from "../utils/db.js";

export default {
    findAll() {
        return db('product');
    },

    findByCatID(catID) {
        return db('product').where('Category', catID);
    },

    findFiveEarlyExpired() {
        return db('product').orderBy('DateExpired', 'asc').limit(5);
    },

    findFiveHighestPrice() {
        return db('product').orderBy('PriceBuyNow', 'desc').limit(5);
    },

    findFiveHighestTurn() {
        return db('product').orderBy('Turn', 'desc').limit(5);
    },

    async findByProName(proName) {
        const sql = `SELECT * FROM product 
                    where MATCH (Name) 
                    AGAINST (?);`
        const values = [
            proName,
        ];
        const raw = await db.raw(sql, values);
        // console.log(raw[0]);
        return raw[0];
    },

    async findByID(id) {
        const list = await db('product').where('ID', id);
        console.log(list);
        if (list.length === 0)
            return null;

        return list[0];
    },

    delete(id) {
        return db('product').where('ID', id).del();
    },

    distance(date){
    let temp = Math.abs(new Date() - date) / 1000;
    let days = Math.floor(temp/(60 * 60 * 24));
    temp = temp%(60 * 60 * 24);
    let hours = Math.floor(temp/(60*60));
    temp = temp%(60 * 60);
    let mins = Math.floor(temp/60);
    temp = temp%( 60);
    let secs = Math.floor(temp)
    return days+" days "+hours+"h:"+mins+"m:"+secs+"s";
    }
}