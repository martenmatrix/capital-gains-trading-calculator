import { FiFoCalculator } from '../calculationsMethods/FiFo';

describe('FiFo Calculation', () => {
    const input = [
                {
                    amount: 100,
                    date: new Date('2019-01-01'),
                    totalPrice: 200.00,
                    symbol: 'FIRST',
                    type: 'BUY',
                },
                {
                    amount: 10.50,
                    date: new Date('2020-01-01'),
                    totalPrice: 10.00,
                    symbol: 'FIRST',
                    type: 'BUY',
                },
                {
                    amount: 105,
                    date: new Date('2020-01-01'),
                    totalPrice: 300,
                    symbol: 'FIRST',
                    type: 'SELL',
                },
        ]

    const fifo = FiFoCalculator();

    test('Able to add items', () => {
        fifo.setHistory(input);
    });
});
