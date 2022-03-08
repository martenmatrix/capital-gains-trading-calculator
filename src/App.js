import { useEffect, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Trading212 } from './calculation';
import { getFileAsText, mergeCSV, csvTextToArray } from './misc';
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

    async function getArray() {
        const csvs = [];

        await Promise.all(files.map(async (file) => {
            const text = await getFileAsText(file);
            const csvArray = csvTextToArray(text);
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

    return (
        <div className="results">

        </div>
    );
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
