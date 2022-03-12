import transformer from '../../revolut/transformer.js';
import history from './tradingHistory';

describe('Transformer of Revolut', () => {
    test('able to add actions', () => {
        transformer.addAction(...history);
    });
    test('able to get fees', () => {

    });
    test('able to get years', () => {
        const years = transformer.getYears();
        expect(years).toEqual(['2021', '2022']);
    });
    test('able to get currency', () => {
        const currency = transformer.getCurrency();
        expect(currency).toBe('EUR');
    });
});
