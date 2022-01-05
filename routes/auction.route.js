import auctionModel from "../models/auction.model.js";
import auctionHistoryModel from "../models/auctionhistory.model.js"
import productModel from "../models/product.model.js";
import express from 'express';

const router = express.Router();

router.post('/addNewPrice', async function (req, res) {
    req.body.AuctionTime = new Date();
    await auctionModel.add(req.body);

    const highestPrice = req.body.HighestPrice;
    let presentPrice = await productModel.findPresentPriceByProID(req.body.ProductID);
    const highestBidder = await productModel.findHighestBidderByProID(req.body.ProductID);
    const stepPrice = await productModel.findStepByProID(req.body.ProductID);
    let turn = await productModel.findTurnByProID(req.body.ProductID);
    const requiredPrice = presentPrice+stepPrice;

    if (req.body.HighestPrice >= (presentPrice+stepPrice)) {
        if (highestBidder.HighestBidder === null) {
            presentPrice = presentPrice + stepPrice;
            await productModel.updateHighestPriceAndBidderAndTurn(req.body.ProductID, presentPrice, req.body.BidderID,turn+1);
            await auctionHistoryModel.add({BidderID: req.body.BidderID, ProductID: req.body.ProductID, CurrentPrice: presentPrice, AuctionTime: req.body.AuctionTime});
        }
        else {
            const anotherHighestPrice = await auctionModel.findHighestPrice(highestBidder.HighestBidder, req.body.ProductID);
            if (highestPrice > anotherHighestPrice) {
                presentPrice = anotherHighestPrice + stepPrice;
                console.log(req.body.BidderID);
                await productModel.updateHighestPriceAndBidderAndTurn(req.body.ProductID, presentPrice, req.body.BidderID, turn+1);
                await auctionHistoryModel.add({BidderID: req.body.BidderID, ProductID: req.body.ProductID, CurrentPrice: presentPrice, AuctionTime: req.body.AuctionTime});
            } else {
                presentPrice = highestPrice;
                await productModel.updateHighestPriceAndBidderAndTurn(req.body.ProductID, presentPrice, highestBidder.HighestBidder,turn+1);
                await auctionHistoryModel.add({BidderID: highestBidder.HighestBidder, ProductID: req.body.ProductID, CurrentPrice: presentPrice, AuctionTime: req.body.AuctionTime});
            }
        }

    }

    const url = req.headers.referer || '/';
    res.redirect(url);
})

export default router;