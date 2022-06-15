import { convertDateStringsToDateObjects } from "../misc";

test('able to convert dates in the following format dd/mm/yyyy hh:mm', () => {
   const objectWithDate = [{ date: '25/03/2003 15:16' }, { date: '20/03/2003 15:16' }];
   
   const objectsWithConvertedDates = convertDateStringsToDateObjects(objectWithDate, 'date');

   expect(objectsWithConvertedDates).toEqual([{ date: new Date(2003, 3, 25, 15, 16) }, { date: new Date(2003, 3, 20, 15, 16) }]);
});