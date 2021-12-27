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
}