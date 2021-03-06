import { engine } from 'express-handlebars';
import hbs_sections from 'express-handlebars-sections';
import numeral from 'numeral';

export default function(app) {
    app.engine('hbs', engine ({
        defaultLayout: 'layout.hbs',
        helpers: {
            format_number(val) {
                return numeral(val).format('0,0');
            },
            section: hbs_sections(),
            isChild,
            isNotNull,
            equal,
            isTrue,
            isFalse,
            checkNewUpload,
            encryptBidder
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
function isNull(HighestBidder) {
    return null === HighestBidder;
}
function equal(value1,value2){
    console.log(value2);
    return value1===value2;
}
function isTrue(value1){
    return value1===true;
}
function isFalse(value1){
    return value1===false;
}
function checkNewUpload(newUpload) {
    return newUpload===true;
}
function encryptBidder(username) {
    return "***"+username.slice(-3);
}