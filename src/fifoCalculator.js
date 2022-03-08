/* {
    amount: 10,
    date: new Date('2020-01-01'),
    price: 100,
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
                buyHistory.push(copyOfObject);
            } else if (copyOfObject.type === 'SELL') {
                copyOfObject.amountUsed = 0;
                sellHistory.push(copyOfObject);
            }
        });
    }

    return { addHistory };
}

export default FIFOCalculator;