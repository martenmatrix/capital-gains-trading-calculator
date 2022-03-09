/* {
    amount: 10.00 FLOAT,
    date: new Date('2020-01-01') DATE,
    totalPrice: 100.00 FLOAT when buying spent / when selling gained,
    symbol: 'STK1' STRING,
    type: 'BUY' / 'SELL' STRING,
  } */

// maybe switch to this library https://github.com/bernardobelchior/fifo-capital-gains-js
import { getObjectsSortedByDate } from "./misc";
import { format } from "date-fns";

const FIFOCalculator = () => {
    const buyHistory = [];
    const sellHistory = [];

    function addHistory(objectArray) {
        objectArray.forEach(object => {
            const copyOfObject = {...object};
            
            if (copyOfObject.type === 'BUY') {
                copyOfObject.amountUsed = 0;
                buyHistory.push(copyOfObject);
            } else if (copyOfObject.type === 'SELL') {
                sellHistory.push(copyOfObject);
            }
        });
    }

    function getAllYears(history) {
        //TODO i did write this already
        const possibleYears = [];
        history.forEach(object => {
            const date = object.date;
            const year = format(date, 'yyyy');
            possibleYears.push(year);

        });
        return possibleYears;
    }

    function getExpensesAndIncomes() {
        const expensesAndIncomes = [];

        const buyHistorySorted = getObjectsSortedByDate(buyHistory, 'date');
        const sellHistorySorted = getObjectsSortedByDate(sellHistory, 'date');

        for (const sellAction of sellHistorySorted) {

            const data = {
                totalExpense: 0,
                totalIncome: sellAction.totalPrice,
                amountLeft: sellAction.amount,
                year: format(sellAction.date, 'yyyy'),
                symbol: sellAction.symbol,
            };

            for (const buyAction of buyHistorySorted) {
                if (sellAction.symbol !== buyAction.symbol) continue;

                const pricePerShareOfBuyAction = buyAction.totalPrice / buyAction.amount;
                const buyActionAmountLeft = buyAction.amount - buyAction.amountUsed;

                // choose the maximum available amount to use
                const buyActionAmountToUse = Math.min(data.amountLeft, buyActionAmountLeft);

                const currentTotalExpense = pricePerShareOfBuyAction * buyActionAmountToUse;
                data.totalExpense += currentTotalExpense;
                data.amountLeft -= buyActionAmountToUse;

                if (data.amountLeft === 0) break;
            }

            expensesAndIncomes.push(data);
        }

        // final check if every sell is done
        const sameLength = sellHistorySorted.length === expensesAndIncomes.length;
        const noAmountLeft = expensesAndIncomes.every((obj) => obj.amountLeft === 0);
        if (!(sameLength && noAmountLeft)) {
            throw new Error('The calculation performed by the application is invalid.')
        } else {
            return expensesAndIncomes;
        }
    }
    
    return { addHistory };
}

export default FIFOCalculator;