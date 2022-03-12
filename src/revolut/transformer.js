import { getAllYears } from '../misc';
import { parseJSON, format } from 'date-fns';

const Revolut = (function () {
    const actionsDone = [];
    let buysAndSells = {
        buys: [],
        sells: []
    }
    
    function addAction(...actions) {
        for (const action of actions) {
            actionsDone.push(action);
        }
        getBuysAndSells();
    }

    function getSpecificActions(key, value) {
        const filteredActions = [];
        actionsDone.forEach((action) => {
            if (action[key] === value) {
                filteredActions.push(action);
            }
        });

        return filteredActions;
    }

    function getBuysAndSells() {
        const exchanges = getSpecificActions('Type', 'EXCHANGE');
        const newObject = {
            buys: [],
            sells: []
        }
        exchanges.forEach((exchange) => {
            const exchangedTo = exchange.Description.match(/Exchanged to ([A-Z]{3})/)[1];
            const assetCurrency = exchange.Currency;
            const isBuy = (assetCurrency === exchangedTo) ? true : false;

            const getPrice = (isBuy) => {
                const completedDate = exchange['Completed Date'];
                const parsedDate = parseJSON(completedDate);
                const humanReadableDate = format(parsedDate, 'PPPPpppp');

                const stringPrice = prompt(`You ${isBuy ? 'bought' : 'sold'} some ${assetCurrency} `+
                `at approx. ${humanReadableDate}. Please enter the price you've`+
                `${isBuy ? 'paid for' : 'got for selling'} that asset in ${getCurrency()}`)
                const price = parseFloat(stringPrice.replace(',', '.'));
                return price;
            }

            const price = getPrice(isBuy);
            const total = {
                amount: price,
                currency: getCurrency(),
            }
            if (isBuy) {
                newObject.buys.push({ ...exchange, ...total });
            } else if (!isBuy) {
                newObject.buys.push({ ...exchange, ...total });
            }
        });
        buysAndSells = newObject;
    }

    function getFees(year) {

    }

    function getYears() {
        return getAllYears(actionsDone, 'Completed Date');
    }

    function getCurrency() {
        // TODO this might not work, if user has multiple currencies on his account 
        const notValid = ['XAG', 'XAU'];
        const regex = /Exchanged to ([A-Z]{3})/;
        for (const trade of actionsDone) {
            const description = trade.Description;
            const currency = description.match(regex)[1];
            if (!notValid.includes(currency)) {
                return currency;
            }
        }
    }

    return { addAction, getFees, getYears, getCurrency };
})();

export default Revolut;
