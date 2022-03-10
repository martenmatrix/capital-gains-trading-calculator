import FiFoCalculator from '../calculationsMethods/FiFo';

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

    test('Set history', () => {
        fifo.setHistory(input);
    });

    test('Get possible years (only years with sell trades)', () => {
        const possibleYears = ['2020'];
        const possibleYearsResponse = fifo.getPossibleYears();
        expect(possibleYearsResponse).toEqual(possibleYears);
    });
});
