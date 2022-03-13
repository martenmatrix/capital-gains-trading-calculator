import { getAllYears } from '../misc';
import { parseJSON, format } from 'date-fns';
import FIFOCalculator from '../calculationsMethods/FiFo';

const Revolut = (function () {
    const actionsDone = [];
    let buysAndSells = []
    
    function addAction(promptFunction = prompt, ...actions) {
        for (const action of actions) {
            actionsDone.push(action);
        }
        getBuysAndSells(promptFunction);
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

    function getBuysAndSells(promptFunction) {
        const exchanges = getSpecificActions('Type', 'EXCHANGE');
        const newArray = [];
        exchanges.forEach((exchange) => {
            const exchangedTo = exchange.Description.match(/Exchanged to ([A-Z]{3})/)[1];
            const assetCurrency = exchange.Currency;
            const isBuy = (assetCurrency === exchangedTo) ? true : false;

            const getPrice = (isBuy) => {
                const completedDate = exchange['Completed Date'];
                const parsedDate = parseJSON(completedDate);
                const humanReadableDate = format(parsedDate, 'PPPPpppp');
                const buyPrice = parseFloat(exchange['Amount']) - parseFloat(exchange['Fee']);

                const stringPrice = promptFunction(`You ${isBuy ? 'bought' : 'sold'} ${Math.abs(buyPrice)} ${assetCurrency} `+
                `at approx. ${humanReadableDate}. Please enter the price you've `+
                `${isBuy ? 'paid for' : 'got for selling'} that asset in ${getCurrency()}.`)
                const price = parseFloat(stringPrice.replace(',', '.'));

                return parseFloat(price);
            }

            const price = getPrice(isBuy);
            const total = {
                amount: price,
                fees: parseFloat(exchange.Fee) / parseFloat(exchange.Amount) * price,
                currency: getCurrency(),
            }
            newArray.push({ ...exchange, total, type: isBuy ? 'BUY' : 'SELL' });
        });
        buysAndSells = newArray;
    }

    function getFees(selectedYear) {
        const totalFees = buysAndSells.reduce((totalFees, action) => {
            const date = parseJSON(action['Completed Date']);
            const year = format(date, 'yyyy');
            if (year !== selectedYear) return totalFees;

            const price = action.total.amount;
            const feesInAsset = parseFloat(action.Fee);
            const amountBoughtOrSold = Math.abs(parseFloat(action.Amount));

            const feesPercentage = feesInAsset / amountBoughtOrSold;
            const fees = feesPercentage * price;
            return totalFees += fees;
        }, 0);
        return totalFees;
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

    function convertForFiFo() {
        const convertedActions = buysAndSells.map(action => {
            return {
                amount: Math.abs(parseFloat(action.Amount)) - parseFloat(action.Fee),
                date: parseJSON(action['Completed Date']),
                totalPrice: action.total.amount - action.total.fees,
                symbol: action.Currency,
                type: action.type,
            }
        });


        return convertedActions;
    }

    function getFiFo() {
        const fifo = FIFOCalculator();
        const actions = convertForFiFo();
        fifo.setHistory(actions);
        return fifo;
    }

    return { addAction, getFees, getYears, getCurrency, getFiFo };
})();

export default Revolut;
