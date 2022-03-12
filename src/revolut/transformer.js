import { convertDateStringsToDateObjects, getAllYears } from '../misc';

const Revolut = (function () {
    const actionsDone = [];
    
    function addAction(...actions) {
        for (const action of actions) {
            actionsDone.push(action);
        }
    }

    function getMissingExpense() {

    }

    function getSpecificAction(actionToGet) {

    }

    // only get buys where an asset was bought, not a currency
    function getBuys() {

    }

    // only get buys where an asset was sold, not a currency
    function getSells() {
        
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
