import { SMTPClient } from 'emailjs';
import express from 'express';

const router = express.Router();

const client = new SMTPClient({
    user: 'emotionauction@gmail.com',
    password: 'ozxgbmnvohbwjaak',
    host: 'smtp.gmail.com',
    ssl: true,
});

router.post('/addPriceSucces', async function (req, res) {
    try {
        const message = await client.sendAsync({
            text: req.body.BidderID + "đã ra giá sản phẩm " + req.body.ProName + " thành công",
            from: 'emotionauction@gmail.com',
            to: req.body.AllNeededMail,
            subject: 'Ra giá thành công trên Emotion Auction',
        });
        console.log(message);
    } catch (err) {
        console.error(err);
    }

    const url = req.headers.referer || '/';
    res.redirect(url);
})

router.post('/RefuseBidder', async function (req, res) {
    try {
        const message = await client.sendAsync({
            text: 'Bạn đã bị từ chối ra giá đối với sản phẩm ' + req.body.ProName,
            from: 'emotionauction@gmail.com',
            to: req.body.AllNeededMail,
            subject: 'Từ chối ra giá trên Emotion Auction',
        });
        console.log(message);
    } catch (err) {
        console.error(err);
    }

    const url = req.headers.referer || '/';
    res.redirect(url);
})

router.post('/AuctionEndingWithoutBidder', async function (req, res) {
    try {
        const message = await client.sendAsync({
            text: 'Sản phẩm ' + req.body.ProName + " đã kết thúc mà không ai đấu giá",
            from: 'emotionauction@gmail.com',
            to: req.body.AllNeededMail,
            subject: 'Đấu giá kết thúc',
        });
        console.log(message);
    } catch (err) {
        console.error(err);
    }

    const url = req.headers.referer || '/';
    res.redirect(url);
})

router.post('/AuctionEnding', async function (req, res) {
    try {
        const message = await client.sendAsync({
            text: 'Sản phẩm ' + req.body.ProName + " đã kết thúc đấu giá",
            from: 'emotionauction@gmail.com',
            to: req.body.AllNeededMail,
            subject: 'Đấu giá kết thúc',
        });
        console.log(message);
    } catch (err) {
        console.error(err);
    }

    const url = req.headers.referer || '/';
    res.redirect(url);
})

export default router;