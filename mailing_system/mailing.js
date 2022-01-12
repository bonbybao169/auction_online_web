import {SMTPClient} from 'emailjs';

const client = new SMTPClient({
    user: 'emotionauction@gmail.com',
    password: 'ozxgbmnvohbwjaak',
    host: 'smtp.gmail.com',
    ssl: true,
});

export default {
    addPriceSucces(BidderID, ProName, AllNeededMail) {
        try {
            const message = await client.sendAsync({
                text: BidderID + "đã ra giá sản phẩm " + ProName + " thành công",
                from: 'emotionauction@gmail.com',
                to: AllNeededMail,
                subject: 'Ra giá thành công trên Emotion Auction',
            });
            console.log(message);
        } catch (err) {
            console.error(err);
        }
    },

    RefuseBidder(ProName, AllNeededMail) {
        try {
            const message = await client.sendAsync({
                text: 'Bạn đã bị từ chối ra giá đối với sản phẩm ' + ProName,
                from: 'emotionauction@gmail.com',
                to: AllNeededMail,
                subject: 'Từ chối ra giá trên Emotion Auction',
            });
            console.log(message);
        } catch (err) {
            console.error(err);
        }
    },

    AuctionEndingWithoutBidder(ProName, AllNeededMail) {
        try {
            const message = await client.sendAsync({
                text: 'Sản phẩm ' + ProName + " đã kết thúc mà không ai đấu giá",
                from: 'emotionauction@gmail.com',
                to: AllNeededMail,
                subject: 'Đấu giá kết thúc',
            });
            console.log(message);
        } catch (err) {
            console.error(err);
        }
    },

    AuctionEnding(ProName, AllNeededMail) {
        try {
            const message = await client.sendAsync({
                text: 'Sản phẩm ' + ProName + " đã kết thúc đấu giá",
                from: 'emotionauction@gmail.com',
                to: AllNeededMail,
                subject: 'Đấu giá kết thúc',
            });
            console.log(message);
        } catch (err) {
            console.error(err);
        }
    },
}