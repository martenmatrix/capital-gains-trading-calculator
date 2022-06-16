// Converts a complete ISO date string in UTC time, the typical format for transmitting a date in JSON, to a JavaScript Date instance.
import FiFo from '../calculationsMethods/FiFo';
import { parseJSON, format, parse } from 'date-fns';
import { getAllYears } from '../misc';

const Trading212 = (function () {
    const actionsDone = [];

    function convertDateToJSONFormat(date) {
        // TODO specific date conversions should always happen directly in the functional component
        const dateObject = parse(date, 'dd-MM-yyyy kk:mm', new Date());
        return JSON.stringify(dateObject);
    }

    function addActions(actions) {
        const actionsWithConvertedDates = actions.map(action => {
            if (action.Time.length < 19) {
                const dateStringWithoutBackslash = action.Time.replaceAll('/', '-');
                action.Time = convertDateToJSONFormat(dateStringWithoutBackslash);
            }
            return action;
        });
        actionsDone.push(...actionsWithConvertedDates);
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
                newObject[currencyKey] = String(totalWithoutFee);
                newObject['FeesDeductedFromTotal'] = true;
            }
            return newObject;
        });
        return removedFees;
    }

    function convertForFIFOCalculation(actions) {
        const convertedActions = actions.map(action => {
            const convertedAction = {};
            convertedAction.amount = parseFloat(action['No. of shares']);
            convertedAction.date = action.Time;
            convertedAction.totalPrice = parseFloat(action[getTotalCurrencyKey(actions)]);
            convertedAction.symbol = action.Ticker;
            const getAction = () => {
                // TODO add test for limit buy stop buy limit sell stop sell
                if (action.Action === 'Market buy' || action.Action === 'Limit buy' || action.Action === 'Stop buy') return 'BUY';
                else if (action.Action === 'Market sell' || action.Action === 'Limit sell' || action.Action === 'Stop sell') return 'SELL';
                else return action.Action;
            }
            convertedAction.type = getAction();

            return convertedAction;
        });

        return convertedActions;
    }

    function calculateFiFo() {
        const actionsWithoutFees = removeCurrencyConversionFeesFromTotal(actionsDone);

        const onlyBuys = getSpecificActions(actionsWithoutFees, 'Market buy');
        const onlySells = getSpecificActions(actionsWithoutFees, 'Market sell');
        const onlySellsAndBuys = [...onlyBuys, ...onlySells];

        const withoutDuplicates = getActionsWithoutDuplicates(onlySellsAndBuys);
        const FIFOFormat = convertForFIFOCalculation(withoutDuplicates);
        const fifo = FiFo();
        fifo.setHistory(FIFOFormat);

        return fifo;
    }

    function getCurrencyConversionFees(selectedYear) {
        const getYear = (stringDate) => {
            const date = parseJSON(stringDate);
            const year = format(date, 'yyyy');
            return year;
        }

        const feeKey = getConversionFeeKey(actionsDone);
        const fees = actionsDone.reduce((currentFee, action) => {
            if (getYear(action.Time) !== selectedYear) {
                return currentFee;
            }

            const fee = action[feeKey];
            if (fee) {
                const fee = parseFloat(action[feeKey]);
                return currentFee + fee;    
            }
            return currentFee;
        }, 0)

        return fees;
    }
 
    function getYears() {
        return getAllYears(actionsDone, 'Time');
    }

    function getCurrency() {
        const totalString = getTotalCurrencyKey(actionsDone);
        const currencySymbol = totalString.match(/Total \(([A-Z]{3})\)/)[1];
        return currencySymbol;
    }

    return { addActions, calculateFiFo, getCurrencyConversionFees, getYears, getCurrency };
})()

export default Trading212;
