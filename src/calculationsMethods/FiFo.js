// possible alternative is https://github.com/bernardobelchior/fifo-capital-gains-js

import { getObjectsSortedByDate, getAllYears } from "../misc";
import { format } from "date-fns";

const FIFOCalculator = () => {
    const round = (number) => Math.round(number * 100000000000) / 100000000000; // 10 decimals

    const data = {
        buyHistory: null,
        sellHistory: null,
        expensesAndIncomes: null,
    }

    function getAndSetExpensesAndIncomes() {
        const expensesAndIncomes = [];

        const buyHistorySorted = getObjectsSortedByDate(data.buyHistory, 'date');
        const sellHistorySorted = getObjectsSortedByDate(data.sellHistory, 'date');

        for (const sellAction of sellHistorySorted) {

            const data = {
                totalExpense: 0,
                totalIncome: round(sellAction.totalPrice),
                amountLeft: round(sellAction.amount),
                year: format(sellAction.date, 'yyyy'),
                symbol: sellAction.symbol,
            };

            for (const buyAction of buyHistorySorted) {
                if (sellAction.symbol !== buyAction.symbol) continue;

                const pricePerShareOfBuyAction = round(buyAction.totalPrice / buyAction.amount);
                const buyActionAmountLeft = round(buyAction.amount - buyAction.amountUsed);

                // choose the maximum available amount to use
                const buyActionAmountToUse = Math.min(data.amountLeft, buyActionAmountLeft);

                const currentTotalExpense = round(pricePerShareOfBuyAction * buyActionAmountToUse);
                data.totalExpense = round(data.totalExpense + currentTotalExpense);
                data.amountLeft = round(data.amountLeft - buyActionAmountToUse);

                if (data.amountLeft === 0) break;
            }

            expensesAndIncomes.push(data);
        }

        console.table(expensesAndIncomes);

        // final check if every sell is done
        const sameLength = sellHistorySorted.length === expensesAndIncomes.length;
        const noAmountLeft = expensesAndIncomes.every((obj) => obj.amountLeft === 0);
        if (!(sameLength && noAmountLeft)) {
            throw new Error('The calculation performed by the application is invalid. This could be due to a missing history e.g. there were more shares sold than bought.');
        } else {
            data.expensesAndIncomes = expensesAndIncomes;
        }
    }

    function setHistory(objectArray) {
        const buyHistory = [];
        const sellHistory = [];

        objectArray.forEach(object => {
            const copyOfObject = {...object};
            
            if (copyOfObject.type === 'BUY') {
                copyOfObject.amountUsed = 0;
                buyHistory.push(copyOfObject);
            } else if (copyOfObject.type === 'SELL') {
                sellHistory.push(copyOfObject);
            }
        });

        data.buyHistory = buyHistory;
        data.sellHistory = sellHistory;

        getAndSetExpensesAndIncomes();
    }
    
    function getPossibleYears() {
        return getAllYears(data.expensesAndIncomes, 'year');
    }

    function getRealizedProfits(year) {
        const expensesAndIncomes = data.expensesAndIncomes;
        const totalProfit = expensesAndIncomes.reduce((currProfit, obj) => {
            if (obj.year === year) {
                const profit = round(obj.totalIncome - obj.totalExpense);
                return round(currProfit + profit);
            }
            return currProfit;
        }, 0);

        return totalProfit;
    }

    return { setHistory, getPossibleYears, getRealizedProfits };
}

export default FIFOCalculator;