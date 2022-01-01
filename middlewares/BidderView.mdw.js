import { engine } from 'express-handlebars';
import numeral from 'numeral';

export default function(app) {
    app.engine('hbs', engine ({
        defaultLayout: 'BidderLayout.hbs',
        helpers: {
            format_number(val) {
                return numeral(val).format('0,0');
            },
            isChild,
            isNotNull,
        }
    }));
    app.set('view engine', 'hbs');
    app.set('views', './views');
}

function isChild(parentID, catID) {
    return parentID === catID;
}
function isNotNull(HighestBidder) {
    return null !== HighestBidder;
}
