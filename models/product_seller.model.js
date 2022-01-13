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
    findByCatIDPostingDif(username,ProID,catID, limit, offset) {
        const date = new Date();
        return db('product').where('Category', catID).whereNot('ID', ProID)
            .where('DateExpired', '>=', date).where('Seller', username).limit(limit).offset(offset);

    },



    async countByCatIDPosting(username,catID) {
        const date = new Date();
        const list = await db('product').where('Category', catID)
            .where('DateExpired', '>=', date).where('Seller', username).count({quantity: 'ID'});
        return list[0].quantity;
    },

    async findAllMyproductAuction(username,limit, offset) {
        const date = new Date();
        const listID= [];
        const list= await db('product')
            .join('auctionhistory', 'product.ID','=', 'auctionhistory.ProductID').where('product.DateExpired', '<', date)
            .where('Seller', username).limit(limit).offset(offset).distinct('product.ID');

        for(let i=0;i<list.length;i++){
            console.log(list[i])
            listID.push(list[i].ID);
        }
        return db('product').orderBy('DateExpired', 'desc')
            .whereIn('ID', listID).limit(limit).offset(offset);
    },

    async countAllMyproductAuction(username) {
        const date = new Date();
        const list = await  db('product')
            .join('auctionhistory', 'product.ID','=', 'auctionhistory.ProductID').where('product.DateExpired', '<', date)
            .where('Seller', username).countDistinct({quantity: 'ID'});
        return list[0].quantity;
    },






    async findByCatIDAuction(username,catID, limit, offset) {
        const date = new Date();
        const listID= [];
        const list= await db('product')
            .join('auctionhistory', 'product.ID','=', 'auctionhistory.ProductID').where('product.DateExpired', '<', date)
            .where('Category', catID).where('Seller', username).limit(limit).offset(offset).distinct('product.ID');
        for(let i=0;i<list.length;i++){
            listID.push(list[i].ID);
        }
        return db('product').orderBy('DateExpired', 'desc')
            .whereIn('ID', listID).limit(limit).offset(offset);
    },

    async findByCatIDAuctionDif(username,ProID,catID, limit, offset) {
        const date = new Date();
        const listID= [];
        const list= await db('product')
            .join('auctionhistory', 'product.ID','=', 'auctionhistory.ProductID').where('product.DateExpired', '<', date)
            .where('Category', catID).where('Seller', username).limit(limit).offset(offset).distinct('product.ID');
        for(let i=0;i<list.length;i++){
            if (list[i].ID !==ProID)
            listID.push(list[i].ID);
        }
        return db('product').orderBy('DateExpired', 'desc')
            .whereIn('ID', listID).limit(limit).offset(offset);
    },



    async countByCatIDAuction(username,catID) {
        const date = new Date();
        const list = await  db('product')
            .join('auctionhistory', 'product.ID','=', 'auctionhistory.ProductID').where('product.DateExpired', '<', date)
            .where('Category', catID).where('Seller', username).countDistinct({quantity: 'ID'});
        return list[0].quantity;
    },


    editDescription(ProID,newDes) {
        return db('product')
            .where({ ID: ProID })
            .update({ FullDes: newDes }, ['ID', 'FullDes']);
    },

    cancelTransaction(ProID) {
        return db('product')
            .where({ ID: ProID })
            .update({ isCancel: 1 }, ['ID', 'isCancel']);
    },

    async isCancel(ProID){
        const list = await db('product').where('ID', ProID).select('isCancel');
        return list[0].isCancel===1;
    },



}