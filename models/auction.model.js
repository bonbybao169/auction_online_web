import db from '../utils/db.js';

export default {
    async findHighestPrice(BidderID, ProductID) {
        const list = await db('autoauctionsystem').select('HighestPrice').where('BidderID', BidderID).where('ProductID', ProductID);
        return list[0].HighestPrice;
    },

    add(entity) {
        return db('autoauctionsystem').insert(entity);
    },
}