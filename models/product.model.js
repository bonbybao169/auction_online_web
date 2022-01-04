import db from "../utils/db.js";

export default {
    findAll(limit, offset) {
        return db('product').limit(limit).offset(offset);
    },

    async countAll() {
        const list = await db('product').count({quantity: 'ID'});
        return list[0].quantity;
    },

    findByCatID(catID, limit, offset) {
        return db('product').where('Category', catID).limit(limit).offset(offset);
    },

    findByCatIDExceptProID(proID, catID, limit) {
        return db('product').where('Category', catID).whereNotIn('ID',[proID]).limit(limit);
    },

    async countByCatID(catID) {
        const list = await db('product').where('Category', catID).count({quantity: 'ID'});
        return list[0].quantity;
    },

    findFiveEarlyExpired() {
        return db('product').orderBy('DateExpired', 'asc').limit(5);
    },

    findFiveHighestPrice() {
        return db('product').orderBy('PresentPrice', 'desc').limit(5);
    },

    findFiveHighestTurn() {
        return db('product').orderBy('Turn', 'desc').limit(5);
    },

    async findByProName(proName, limit, offset) {
        const sql = `SELECT * FROM product 
                    where MATCH (Name) 
                    AGAINST (?) LIMIT ? OFFSET ?`
        const values = [
            proName,
            limit,
            offset
        ];

        const raw = await db.raw(sql, values);
        // console.log(raw[0]);
        return raw[0];
    },

    async countByProName(proName) {
        const sql = `SELECT COUNT(ID) as quantity FROM product 
                    where MATCH (Name) 
                    AGAINST (?)`
        const values = [
            proName
        ];

        const raw = await db.raw(sql, values);
        // console.log(raw[0]);
        return raw[0][0].quantity;
    },

    async findByID(id) {
        const list = await db('product').where('ID', id);
        // console.log(list);

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