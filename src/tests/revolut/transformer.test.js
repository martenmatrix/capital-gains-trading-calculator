import transformer from '../../revolut/transformer.js';
import history from './tradingHistory';

describe('Transformer of Revolut for Gold', () => {
    test('able to add actions', () => {
        const fakePrompt = jest.fn().mockName('get price paid, which normally would be inputted over a prompt')
                                    .mockReturnValueOnce('200')
                                    .mockReturnValueOnce('500')
                                    .mockReturnValueOnce('20,00')
                                    .mockReturnValueOnce('110.00')
                                    .mockReturnValueOnce('50')
                                    .mockReturnValueOnce('10')
                                    .mockReturnValueOnce('35')
                                    .mockReturnValueOnce('197')
                                    .mockReturnValueOnce('25');

        transformer.addAction(fakePrompt, ...history);
    });
    test('able to get fees', () => {
        const round = (num) => Math.round(num * 1000000) / 1000000; // 5 decimals

        const actualFees2021 = 2.8824823609491594;
        const fees2021 = transformer.getFees('2021');
        expect(round(fees2021)).toBe(round(actualFees2021));
    });
    test('able to get years', () => {
        const years = transformer.getYears();
        expect(years).toEqual(['2021', '2022']);
    });
    test('able to get currency', () => {
        const currency = transformer.getCurrency();
        expect(currency).toBe('EUR');
    });
    test('able to get fifo', () => {
        const fifo = transformer.getFiFo();
        expect(typeof fifo).toBe('object')
    });
});
