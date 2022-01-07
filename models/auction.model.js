import db from '../utils/db.js';

export default {
    async findHighestPrice(BidderID, ProductID) {
        const list = await db('autoauctionsystem').select('HighestPrice').where('BidderID', BidderID).where('ProductID', ProductID);
        return list[0].HighestPrice;
    },
    async find(BidderID, ProductID){
        const list = await db('autoauctionsystem').where({"BidderID": BidderID,"ProductID": ProductID});
        return list[list.length-1];
    },
    add(entity) {
        return db('autoauctionsystem').insert(entity);
    },
}