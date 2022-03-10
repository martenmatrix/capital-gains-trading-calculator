import { format, isDate, parseJSON } from 'date-fns';

async function getFileAsText(file) {
    const readUploadedFileAsText = (inputFile) => {
        const temporaryFileReader = new FileReader();
      
        return new Promise((resolve, reject) => {
          temporaryFileReader.onerror = () => {
            temporaryFileReader.abort();
            reject(new DOMException("Problem parsing input file."));
          };
      
          temporaryFileReader.onload = () => {
            resolve(temporaryFileReader.result);
          };
          temporaryFileReader.readAsText(inputFile);
        });
    };

    const fileText = await readUploadedFileAsText(file);

    return fileText;
}

function mergeCSV(csvs) {
    const keysToAdd = [];

    // every first element of the csv are compared if the keys are the same
    csvs.forEach((csv1) => {
        const firstElementKeysOfCSV1 = Object.keys(csv1[0]);

        csvs.forEach((csv2) => {
            const firstElementKeysOfCSV2 = Object.keys(csv2[0]);

            const difference = firstElementKeysOfCSV1
                .filter(x => !firstElementKeysOfCSV2.includes(x))
                .concat(firstElementKeysOfCSV2.filter(x => !firstElementKeysOfCSV1.includes(x)));
            
            if (difference.length > 0) {
                difference.forEach((key) => {
                    keysToAdd.push(key);
                });
            }
        });
    });

    const keysToAddWithoutDuplicates = [...new Set(keysToAdd)];

    // iterate over all csv entry and add key if missing
    const mergedCSV = [];

    csvs.forEach((csv) => {
        csv.forEach((csvEntry) => {
            const newObject = {...csvEntry};
            keysToAddWithoutDuplicates.forEach((key) => {
                if (!Object.keys(newObject).includes(key)) {
                    newObject[key] = "";
                }
            });
            mergedCSV.push(newObject);
        });
    });

    return mergedCSV;
}

function csvTextToArray(str, delimiter = ",") {
    const headers = str.slice(0, str.indexOf("\n")).split(delimiter);

    const rows = str.slice(str.indexOf("\n") + 1).split("\n");

    const arr = rows.map(function (row) {
      const values = row.split(delimiter);
      const newObject = headers.reduce(function (object, key, valueIndex) {
        const value = values[valueIndex];
        object[key] = value;
        return object;
      }, {});
      return newObject;
    });

    return arr;
}

function convertDateStringsToDateObjects(actions, key) {
    const actionsWithDateObjects = actions.map(action => {
        const convertedAction = {...action};
        const stringDate = action[key];

        if (!isDate(stringDate)) {
            const dateObject = parseJSON(stringDate);
            convertedAction[key] = dateObject;
        }
        
        return convertedAction;
    });

    return actionsWithDateObjects;
}

function getObjectsSortedByDate(arrayOfObjects, dateKey) {
    const withDateObjects = convertDateStringsToDateObjects(arrayOfObjects, dateKey);

    const copyOfActions = withDateObjects.map(object => ({ ...object }))
    try {
        copyOfActions.sort((firstElement, secondElement) => {
            if (!(isDate(firstElement[dateKey]) && isDate(secondElement[dateKey]))) {
                throw new Error('Trying to sort with invalid dates.')
            }

            return secondElement - firstElement;
        });

        return copyOfActions;
    } catch (e) {
        alert('Some of the dates did not get converted correctly. This could be a problem because you inputted invalid data or because the application did something wrong. Check your data and if that does not solve anything create an issue.');
    }
}

function getAllYears(objects, yearKey) {
    const possibleYears = [];
    objects.forEach(object => {
        let date = object[yearKey];
        if (!isDate(date)) {
            date = parseJSON(date);
        }
        const year = format(date, 'yyyy');
        possibleYears.push(year);
    });
    return possibleYears;
}

export { getFileAsText, mergeCSV, csvTextToArray, convertDateStringsToDateObjects, getObjectsSortedByDate, getAllYears };
