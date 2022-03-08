// Converts a complete ISO date string in UTC time, the typical format for transmitting a date in JSON, to a JavaScript Date instance.
import { format } from 'date-fns';
import { getObjectsSortedByDate } from './misc';

const Trading212 = (function () {
    const actionsDone = [];

    function addActions(actions) {
        actionsDone.push(...actions);
    }

    function getActionsWithoutDuplicates(actions) {
        // creates array of stringified object and normal object of every current object in array
        const stringifiedAndNormal = actions.map(element => [JSON.stringify(element), element]);
        const withoutDuplicates = new Map(stringifiedAndNormal);
        const withoutStringifiedObjects = withoutDuplicates.values();
        // convert iterator to array
        const actionsWithoutDuplicates = [...withoutStringifiedObjects];
        return actionsWithoutDuplicates;
    }

    function getConvertedActions() {
        const withoutDuplicates = getActionsWithoutDuplicates(actionsDone);
        const sortedByDate = getObjectsSortedByDate(withoutDuplicates, 'Time');
        return sortedByDate;
    }

    function getTotalCurrencyKey(actions) {
        const keys = Object.keys(actions[0]);
        const regex = /Total \([A-Z]{3}\)/;
        for (const key of keys) {
            if (regex.test(key)) {
                return key;
            }
        }
    }

    function getConversionFeeKey(actions) {
        const keys = Object.keys(actions[0]);
        const regex = /Currency conversion fee \([A-Z]{3}\)/;
        for (const key of keys) {
            if (regex.test(key)) {
                return key;
            }
        }
    }

    function getSpecificActions(actions, onlyAction) {
        return actions.filter(action => action.Action === onlyAction);
    }

    // deducts fx fees from total price
    function removeCurrencyConversionFeesFromTotal(actions) {
        const currencyKey = getTotalCurrencyKey(actions);
        const conversionKey = getConversionFeeKey(actions);

        const removedFees = actions.map(action => {
            const newObject = {...action};
            const fee = parseFloat(action[conversionKey]);
            const total = parseFloat(action[currencyKey]);
            if (!(isNaN(fee))) {
                const totalWithoutFee = total - fee;
                newObject[currencyKey] = toString(totalWithoutFee);
                newObject['FeesDeductedFromTotal'] = true;
            }
            return newObject;
        });
        return removedFees;
    }

    function getRealizedGains(actions, method, years) {
        if (method === 'fifo') {
        }
    }
    
    function getPossibleYears() {
        const actions = getConvertedActions();
    
        const possibleYears = [];
        actions.forEach(action => {
            const date = action.Time;
            const year = format(date, 'yyyy');
        
            if (!possibleYears.includes(year)) {
                possibleYears.push(year);
            }
        });
        
        return possibleYears;
    }

    function getRealizedProfits(method) {
        const actions = getConvertedActions();
        const actionsWithoutFees = removeCurrencyConversionFeesFromTotal(actions);
        const realizedGains = getRealizedGains(actions, 'fifo', [2021]);
        console.log({actions, actionsWithoutFees});
    }

    function getCurrencyExchangeFees() {

    }

    return { addActions, getRealizedProfits, getCurrencyExchangeFees, getPossibleYears };
})()

export { Trading212 };
