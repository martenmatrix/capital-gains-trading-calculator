import FiFoCalculator from '../calculationsMethods/FiFo';

describe('FiFo Calculation', () => {
    const input = [
                {
                    amount: 100,
                    date: new Date('2019-01-01'),
                    totalPrice: 200.00,
                    symbol: 'FIRST',
                    type: 'BUY', // 2 price per 1 share
                },
                {
                    amount: 10.50,
                    date: new Date('2020-01-01'),
                    totalPrice: 10.00,
                    symbol: 'FIRST',
                    type: 'BUY', // 0.9523809523809523 price per 1 share
                },
                {
                    amount: 105,
                    date: new Date('2020-01-01'),
                    totalPrice: 300,
                    symbol: 'FIRST',
                    type: 'SELL', // 2.857142857142857 per 1 share
                },
                {
                    amount: 5.5,
                    date: new Date('2020-02-01'),
                    totalPrice: 5,
                    symbol: 'FIRST',
                    type: 'SELL', // 0.9090909090909091 per 1 share
                }
                // for first buy 85.71428571428572 profit
                // for second buy 9.523809523809526 profit (first sell) | -0.23809523809523814 profit (second sell)
                // +95.23809523809524 profit
        ]

    const fifo = FiFoCalculator();

    test('Set history', () => {
        fifo.setHistory(input);
    });

    test('Get possible years (only years with sell trades)', () => {
        const possibleYears = ['2020'];
        const possibleYearsResponse = fifo.getPossibleYears();
        expect(possibleYearsResponse).toEqual(possibleYears);
    });

    test('Get realized profits for year', () => {
        const round = (number) => Math.round(number * 1000000) / 1000000; // 5 decimals
        const realizedProfits = fifo.getRealizedProfits('2020');

        const totalProfits = 95;
        expect(round(realizedProfits.total)).toBe(round(totalProfits));
        const actualIncomes = 95.23809523809524;
        expect(round(realizedProfits.income)).toBe(round(actualIncomes));
        const actualLosses = -0.23809523809523814;
        expect(round(realizedProfits.loss)).toBe(round(actualLosses));
    });
});
