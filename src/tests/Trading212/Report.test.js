import transformer from "../../trading212/transformer";
import history from "./tradingHistory";

// make sure to test multiple trading data entries in csv section

describe('Testing Trading212 data transformer', () => {
    test('Adding actions/history', () => {
        transformer.addActions(history);
    });

    test('Getting currency exchange transaction fees', () => {
        const fees = transformer.getCurrencyConversionFees('2021');
        expect(fees).toBe(0.51);
    });

    test('Gets correct currency symbol', () => {
        const symbol = transformer.getCurrency();
        expect(symbol).toBe('EUR');
    });
});