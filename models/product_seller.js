import db from "../utils/db.js";

export default {
    findAllMyproductPosting(username,limit, offset) {
        const date = new Date();
        return db('product').where('DateExpired', '>=', date).where('Seller', username).limit(limit).offset(offset);
    },

    async countAllMyproductPosting(username) {
        const date = new Date();
        const list = await db('product').count({quantity: 'ID'}).where('DateExpired', '>=', date).where('Seller', username);
        return list[0].quantity;
    },



    add(entity) {
        return db('product').insert(entity);
    },


    findByCatIDPosting(username,catID, limit, offset) {
        const date = new Date();
        return db('product').where('Category', catID)
            .where('DateExpired', '>=', date).where('Seller', username).limit(limit).offset(offset);

    },



    async countByCatIDPosting(username,catID) {
        const date = new Date();
        const list = await db('product').where('Category', catID)
            .where('DateExpired', '>=', date).where('Seller', username).count({quantity: 'ID'});
        return list[0].quantity;
    },

    findAllMyproductAuction(username,limit, offset) {
        const date = new Date();
        return db('product')
            .join('auctionhistory', 'product.ID','=', 'auctionhistory.ProductID').where('product.DateExpired', '<', date)
            .where('Seller', username).limit(limit).offset(offset);
    },

    async countAllMyproductAuction(username) {
        const date = new Date();
        const list = await  db('product')
            .join('auctionhistory', 'product.ID','=', 'auctionhistory.ProductID').where('product.DateExpired', '<', date)
            .where('Seller', username).count({quantity: 'ID'});
        return list[0].quantity;
    },






    findByCatIDAuction(username,catID, limit, offset) {
        const date = new Date();

        return db('product')
            .join('auctionhistory', 'product.ID','=', 'auctionhistory.ProductID').where('product.DateExpired', '<', date)
            .where('Category', catID).where('Seller', username).limit(limit).offset(offset);
    },



    async countByCatIDAuction(username,catID) {
        const date = new Date();
        const list = await  db('product')
            .join('auctionhistory', 'product.ID','=', 'auctionhistory.ProductID').where('product.DateExpired', '<', date)
            .where('Category', catID).where('Seller', username).count({quantity: 'ID'});
        return list[0].quantity;
    },


    editDescription(ProID,newDes) {
        return db('product')
            .where({ ID: ProID })
            .update({ FullDes: newDes }, ['ID', 'FullDes']);
    }


}