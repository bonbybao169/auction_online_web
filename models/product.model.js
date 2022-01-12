import db from "../utils/db.js";

export default {
    findAll(limit, offset) {
        const date = new Date();
        return db('product').where('DateExpired', '>=', date).limit(limit).offset(offset);
    },

    async countAll() {
        const date = new Date();
        const list = await db('product').count({quantity: 'ID'}).where('DateExpired', '>=', date);
        return list[0].quantity;
    },

    async findSellerIDByProID(ProID) {
        const list = await db('product').where('ID', ProID).select('Seller');
        // console.log("Seller", list[0].Seller);
        return list[0].Seller;
    },

    async findIDMax() {

        const list = await db('product').max({ maxID: 'ID' });
        return list[0].maxID+1;
    },

    add(entity) {
        return db('product').insert(entity);
    },

    findByCatID(catID, limit, offset) {
        const date = new Date();
        return db('product').where('Category', catID)
            .where('DateExpired', '>=', date).limit(limit).offset(offset);
    },

    findByCatIDExceptProID(proID, catID, limit) {
        const date = new Date();
        return db('product').where('Category', catID)
            .where('DateExpired', '>=', date).whereNotIn('ID',[proID]).limit(limit);
    },

    async countByCatID(catID) {
        const date = new Date();
        const list = await db('product').where('Category', catID)
            .where('DateExpired', '>=', date).count({quantity: 'ID'});
        return list[0].quantity;
    },

    async findByWatchList(username, limit, offset) {
        const list = await db('watchlist').where('Username', username).select('ProductID');
        const listID= [];
        for(let i=0;i<list.length;i++){
            listID.push(list[i].ProductID);
        }
        return db('product').orderBy('DateExpired', 'desc')
            .whereIn('ID', listID).limit(limit).offset(offset);
    },
    async countByWatchList(Username) {
        const list = await db('watchlist').where('Username', Username).count({quantity: 'ProductID'});

        return list[0].quantity;
    },

    async findFiveEarlyExpired() {
        let sql = `SELECT COUNT(*)-5 AS ProductQuantity FROM product WHERE (DateExpired - NOW() > 0)`;
        let raw = await db.raw(sql);
        const limit = raw[0][0].ProductQuantity;

        sql = `SELECT * FROM product WHERE (DateExpired - NOW() > 0) ORDER BY DateExpired DESC LIMIT ?,5`;
        const values = [
            limit
        ]
        raw = await db.raw(sql, values);
        return raw[0];
    },

    findFiveHighestPrice() {
        const date= new Date();
        return db('product').orderBy('PresentPrice', 'desc')
            .where('DateExpired', '>=', date).limit(5);
    },

    findFiveHighestTurn() {
        const date= new Date();
        return db('product').orderBy('Turn', 'desc')
            .where('DateExpired', '>=', date).limit(5);
    },

    async findByProName(proName, limit, offset, DateExpiredDescend, PriceAscend) {
        if (DateExpiredDescend === 1) {
            const sql = `SELECT * FROM product 
                    where MATCH (Name) 
                    AGAINST (?) ORDER BY DateExpired DESC LIMIT ? OFFSET ?`
            const values = [
                proName,
                limit,
                offset
            ];

            const raw = await db.raw(sql, values);
            // console.log(raw[0]);
            return raw[0];
        }
        else {
            if (PriceAscend === 1) {
                const sql = `SELECT * FROM product 
                    where MATCH (Name) 
                    AGAINST (?) ORDER BY PresentPrice ASC LIMIT ? OFFSET ?`
                const values = [
                    proName,
                    limit,
                    offset
                ];

                const raw = await db.raw(sql, values);
                // console.log(raw[0]);
                return raw[0];
            }
            else {
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
            }
        }
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
        return list[0];
    },

    async findPresentPriceByProID(id) {
        const list = await db('product').select('PresentPrice').where('ID', id);

        return list[0].PresentPrice;
    },

    async findStepByProID(id) {
        const list = await db('product').select('Step').where('ID', id);

            return list[0].Step;
    },

    async findHighestBidderByProID(id) {
        const list = await db('product').select('HighestBidder').where('ID', id);
        return list[0];
    },

    async findTurnByProID(id) {
        const list = await db('product').select('Turn').where('ID', id);
        // console.log(list);

        return list[0].Turn;
    },

    async findByWinningList(username, limit, offset) {
        return db('product').where('Winner', username).limit(limit).offset(offset);
    },

    async countByWinningList(username) {
        const list = await db('product').where('Winner', username).count({quantity: 'ID'});
        return list[0].quantity;
    },

    async findByAuctionList(username, limit, offset) {
        const date = new Date();
        const list = await db('auctionhistory')
            .where('BidderID', username).select('ProductID');
        const listID= [];
        for(let i=0;i<list.length;i++){
            listID.push(list[i].ProductID);
        }
        return db('product').whereIn('ID', listID)
            .where('DateExpired', '>=', date).limit(limit).offset(offset);
    },

    async countByAuctionList(username) {
        const date = new Date();
        const list1 = await db('auctionhistory')
            .where('BidderID', username).select('ProductID');
        const listID= [];
        for(let i=0;i<list1.length;i++){
            listID.push(list1[i].ProductID);
        }
        const list2 = await db('product').whereIn('ID', listID)
            .where('DateExpired', '>=', date)
            .count({quantity: 'ID'});
        return list2[0].quantity;
    },

    async countWatchListbyEntity(entity){
        const list = await db('watchlist').where(entity).count({quantity: 'ProductID'});
        return list[0].quantity;
    },
    
    async countRatebyEntity(entity){
        const list = await db('rate').where(entity).count({quantity: 'ProductID'});
        return list[0].quantity;
    },

    async countProductbyEntity(entity){
        const list = await db('product').where(entity).count({quantity: 'ID'});
        return list[0].quantity;
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
    },

    timeDifference(end, start) {
        var msPerMinute = 60 * 1000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;

        var elapsed = end - start;

        if (elapsed < 0) {
            return 'Sản phẩm hết hạn';
        }
        else if (elapsed < msPerMinute) {
            return Math.round(elapsed/1000) + ' giây nữa';
        }
        else if (elapsed < msPerHour) {
            return Math.round(elapsed / msPerMinute) + ' phút nữa';
        }
        else if (elapsed < msPerDay ) {
            return Math.round(elapsed/msPerHour ) + ' giờ nữa';
        }
        else if (elapsed < msPerMonth) {
            if (Math.round(elapsed/msPerDay) < 4) {
                return Math.round(elapsed / msPerDay) + ' ngày nữa';
            }
            else {
                return false;
            }
        }
    },

    timeDifferenceUnder31Min(end, start) {
        var msPerMinute = 60 * 1000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;

        var elapsed = end - start;
        if (elapsed < msPerHour) {
            if (Math.round(elapsed / msPerMinute) < 31) {
                return true
            }
            else return false;
        } else {
            return false;
        }
    },

    timeDifference2(end, start) {
        var msPerMinute = 60 * 1000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;

        var elapsed = end - start;

        if (elapsed < 0) {
            return 'Sản phẩm hết hạn';
        } else if (elapsed < msPerMinute) {
            return Math.round(elapsed / 1000) + ' giây nữa';
        } else if (elapsed < msPerHour) {
            return Math.round(elapsed / msPerMinute) + ' phút nữa';
        } else if (elapsed < msPerDay) {
            return Math.round(elapsed / msPerHour) + ' giờ nữa';
        } else if (elapsed < msPerMonth) {
            return Math.round(elapsed / msPerDay) + ' ngày nữa';
        }
    },

    updateHighestPriceAndBidderAndTurn(proID, highestPrice, highestBidder, newTurn) {
        return db('product').where('ID', proID).update({PresentPrice: highestPrice,
            HighestBidder: highestBidder, Turn: newTurn});
    },

    async getProNameByProID (proID) {
        const list = await db('product').where('ID', proID).select('Name');
        // console.log('ProName', list[0].Name);
        return list[0].Name;
    },
}