// Converts a complete ISO date string in UTC time, the typical format for transmitting a date in JSON, to a JavaScript Date instance.
import { parseJSON } from 'date-fns';

// deducts fx fees (ID) from total eur price

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

    function removeDeposits(actions) {
        return actions.filter(action => action.Action !== "Deposit");
    }

    function getConvertedActions() {
        const withoutDuplicates = getActionsWithoutDuplicates(actionsDone);
        const withoutDeposits = removeDeposits(withoutDuplicates);
        const withDateObjects = convertDateStringsToDateObjects(withoutDeposits, 'Time');
        return withDateObjects;
    }

    function getTotal() {
        const actions = getConvertedActions();
        console.log(actions);
    }

    return { addActions, getTotal };
})()

export { Trading212 };
