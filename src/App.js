import { useEffect, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Trading212 } from './calculation';
import './App.css';

function FileInput(props) {
    const [file, setFile] = props.fileState;

    const onDrop = useCallback(acceptedFiles => {
      setFile(acceptedFiles);
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, accept: '.csv', multiple: true})
  
    return (
      <div className="file-input" {...getRootProps()}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the files here ...</p> :
            <p>Read the text below (i beg you) and drop your CSV file here or <u>click here</u> to select them.</p>
        }
      </div>
    )
}

function InformationBanner() {
    return (
        <div className="information-banner">
            <div className="text">
            Create a CSV file from Trading 212 like <a href="https://helpcentre.trading212.com/hc/en-us/articles/360016898917-Can-I-export-the-trading-data-from-my-account-" target="_blank" rel="noreferrer">this</a>. Export your whole trading history in 12 months CSV's and drop/select them all at once.
                All uploaded files stay on your PC. You can find the code of this application or report issues <a href="https://github.com/martenmatrix/trading212-tax-generator" target="_blank" rel="noreferrer">here</a>.
            </div>
        </div>
    )
}

function LoadingAnimation() {
    return (
        <></>
    )
}

function Report(props) {
    const cbWhenReady = props.cbWhenReady;
    const files = props.files;

    function csvToArray(str, delimiter = ",") {
        // slice from start of text to the first \n index
        // use split to create an array from string by delimiter
        const headers = str.slice(0, str.indexOf("\n")).split(delimiter);

        // slice from \n index + 1 to the end of the text
        // use split to create an array of each csv value row
        const rows = str.slice(str.indexOf("\n") + 1).split("\n");

        // Map the rows
        // split values from each row into an array
        // use headers.reduce to create an object
        // object properties derived from headers:values
        // the object passed as an element of the array
        const arr = rows.map(function (row) {
          const values = row.split(delimiter);
          const newObject = headers.reduce(function (object, key, valueIndex) {
            const value = values[valueIndex];
            object[key] = value;
            return object;
          }, {});
          return newObject;
        });
      
        // return the array
        return arr;
    }
      
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

    async function getArray() {
        const csvs = [];

        await Promise.all(files.map(async (file) => {
            const text = await getFileAsText(file);
            const csvArray = csvToArray(text);
            csvs.push(csvArray);

            Promise.resolve() //TODO do i need to do this?
        }));

        const csvArray = mergeCSV(csvs);
        return csvArray;
    }

    useEffect(() => {
        async function getResults() {
            const csvArray = await getArray();

            // Trading 212
            Trading212.addActions(csvArray);
            Trading212.getTotal();
        }

        getResults();
    }, []);

    return null;
}

function App() {
    const [files, setFiles] = useState(false);

    return (
        <div className="App">
            {files ? <Report files={files} /> : <FileInput fileState={[files, setFiles]} />}
            <InformationBanner />
        </div>
    );
}

export default App;
