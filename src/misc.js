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

export { getFileAsText, mergeCSV, csvTextToArray};
