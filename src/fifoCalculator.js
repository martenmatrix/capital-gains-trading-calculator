/* {
    amount: 10,
    date: new Date('2020-01-01'),
    totalPrice: 100 when buying spent / when selling gained,
    symbol: 'STK1',
    type: 'BUY' / 'SELL',
  } */

// maybe switch to this library https://github.com/bernardobelchior/fifo-capital-gains-js
import { getObjectsSortedByDate } from "./misc";

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
                copyOfObject.done = false;
                sellHistory.push(copyOfObject);
            }
        });
    }

    // pseudo code
    // sort sell history date upscending
    // sort buy history date upscending
    // iterate trough sell history from start
        // for every sell iterate from start over buy history
        // calculate price per share (totalPrice/amount)
        // 3. check if amountOfShares is higher in sellHistory than in buyHistory - amountUsed
            // if yes
                // const avaibleShares = (amountBuy - amountUsedBuy)
                // get leftover not sold shares by sellAmount - avaibleShares
                // save totalAmount, which is (totalBuyPrice / totalBuyAmount) * avaibleShares
                // set amountUsed to amount of buy history (everything should be used up because if statement above)
                // keep iterating over next items and for every object start again at 3. until all sell amount has an identified buy object
                // if no leftover mark buy as done
            // if no
                // const avaibleShares = (amountBuy - amountUsedBuy)
                // get price per share = (totalBuyPrice / totalBuyAmount)
                // const getBuyPrice = price per share * (amountSell)
                // mark sell as done



    return { addHistory };
}

export default FIFOCalculator;