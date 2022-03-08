// Converts a complete ISO date string in UTC time, the typical format for transmitting a date in JSON, to a JavaScript Date instance.
import { format, parseJSON, isDate } from 'date-fns';

function convertDateStringsToDateObjects(actions, key) {
    const actionsWithDateObjects = actions.map(action => {
        const stringDate = action[key];
        const dateObject = parseJSON(stringDate);
        
        const convertedAction = {...action};
        convertedAction[key] = dateObject;
        return convertedAction;
    });

    return actionsWithDateObjects;
}

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

    function getActionsSortedByDate(actions) {
        const withDateObjects = convertDateStringsToDateObjects(actions, 'Time');

        const copyOfActions = withDateObjects.map(object => ({ ...object }))
        try {
            copyOfActions.sort((firstElement, secondElement) => {
                if (!(isDate(firstElement.Time) && isDate(secondElement.Time))) {
                    throw new Error('Trying to sort with invalid dates.')
                }

                return secondElement - firstElement;
            });

            return copyOfActions;
        } catch (e) {
            alert('Some of the dates did not get converted correctly. This could be a problem because you inputted invalid data or because the application did something wrong. Check your data and if that does not solve anything create an issue.');
        }
    }

    function getConvertedActions() {
        const withoutDuplicates = getActionsWithoutDuplicates(actionsDone);
        const sortedByDate = getActionsSortedByDate(withoutDuplicates);
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

    function getTotal(method) {
        const actions = getConvertedActions();
        const actionsWithoutFees = removeCurrencyConversionFeesFromTotal(actions);
        const realizedGains = getRealizedGains(actions, 'fifo', [2021]);
        console.log({actions, actionsWithoutFees});
    }

    return { addActions, getTotal, getPossibleYears };
})()

export { Trading212 };
