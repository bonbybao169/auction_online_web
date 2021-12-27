import db from "../utils/db.js";

export default {
    findAll() {
        return db('product');
    },

    findByCatID(catID) {
        return db('product').where('Category', catID);
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
    }
}