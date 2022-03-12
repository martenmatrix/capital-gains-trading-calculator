import { convertDateStringsToDateObjects, getAllYears } from '../misc';

const Revolut = (function () {
    const actionsDone = [];
    
    function addAction(...actions) {
        for (const action of actions) {
            actionsDone.push(action);
        }
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
        const buysAndSells = {
            buys: [],
            sells: []
        }
        exchanges.forEach((exchange) => {
            const exchangedTo = exchange.Description.match(/Exchanged to ([A-Z]{3})/)[1];
            const assetCurrency = exchange.Currency;
            const isBuy = (assetCurrency === exchangedTo) ? true : false;

            const getPrice = (isBuy) => {
                const stringPrice = prompt(`Hey you ${isBuy ? 'bought' : 'sold'} some shares 
                at approx. ${exchange['Completed Date']}. Please enter the price you've 
                ${isBuy ? 'paid for' : 'got for selling'} that asset in ${getCurrency()}`)
                const price = parseFloat(stringPrice.replace(',', '.'));
                return price;
            }

            const price = getPrice(isBuy);
            const total = {
                amount: price,
                currency: getCurrency(),
            }
            if (isBuy) {
                buysAndSells.buys.push({ ...exchange, ...total });
            } else if (!isBuy) {
                buysAndSells.buys.push({ ...exchange, ...total });
            }
        });
        return buysAndSells;
    }

    function getFees() {

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
