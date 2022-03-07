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
            <p>Read the text below (i beg you) and drop your CSV file here or <u>click here</u> to select it.</p>
        }
      </div>
    )
}

function InformationBanner() {
    return (
        <div className="information-banner">
            <div className="text">
            Create a CSV file from Trading 212 like <a href="https://helpcentre.trading212.com/hc/en-us/articles/360016898917-Can-I-export-the-trading-data-from-my-account-" target="_blank" rel="noreferrer">this</a>. Export every possible year, you will get one CSV per year.
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
          const el = headers.reduce(function (object, header, index) {
            object[header] = values[index];
            return object;
          }, {});
          return el;
        });
      
        // return the array
        return arr;
    }
      
    async function getFilesAsText(files) {
        let filesText = '';

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

        await Promise.all(files.map(async (file) => {
            const text = await readUploadedFileAsText(file);
            filesText += text;
        }));

        return filesText;
    }

    async function getArray() {
        const text = await getFilesAsText(files);
        const array = csvToArray(text);
        console.log(array);
    }

    useEffect(() => {
        getArray();

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
