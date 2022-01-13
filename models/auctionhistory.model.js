import db from '../utils/db.js';

export default {
    add(entity) {
        return db('auctionhistory').insert(entity);
    },
    async findByID(ProductID){
        return await db('auctionhistory')
            .join('user', 'user.Username', '=', 'auctionhistory.BidderID')
            .where({"ProductID": ProductID})
            .select('user.Name',"user.Username","auctionhistory.CurrentPrice","auctionhistory.AuctionTime")
            .orderBy("AuctionTime",'desc');
    }
}