import { useEffect, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { getFileAsText, mergeCSV, csvTextToArray } from './misc';
import LoadingAnimation from './LoadingAnimation';
import './styles/App.css';

// Reports
import Trading212Report from './trading212/Report';

function FileInput(props) {
    const [, setFile] = props.fileState;

    const onDrop = useCallback(acceptedFiles => {
      setFile(acceptedFiles);
    }, [setFile]);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, accept: '.csv', multiple: true})
  
    return (
      <div className="file-input" {...getRootProps()}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the files here ...</p> :
            <p>✨ Read the text below and drop your CSV file here or <u>click here</u> to select them. ✨</p>
        }
      </div>
    )
}

function InformationBanner() {
    return (
        <div className="information-banner">
            <div className="text">
            Create a CSV file from Trading 212 like <a href="https://helpcentre.trading212.com/hc/en-us/articles/360016898917-Can-I-export-the-trading-data-from-my-account-" target="_blank" rel="noreferrer">this</a>. Export your whole trading history in 12 months CSV's and drop/select them all at once.
                All uploaded files stay on your PC. You can find the code of this application or report issues and suggestions <a href="https://github.com/martenmatrix/trading212-tax-generator" target="_blank" rel="noreferrer">here</a>.
            </div>
        </div>
    )
}

function Report(props) {
    const[CSVArray, setCSVArray] = useState(null);
    const files = props.files;
    const reportStyle = 'trading212';

    useEffect(() => {
        async function getAndSetCSVArray() {
            const csvs = [];
    
            await Promise.all(files.map(async (file) => {
                const text = await getFileAsText(file);
                const csvArray = csvTextToArray(text);
                csvs.push(csvArray);
            }));
    
            const csvArray = mergeCSV(csvs);
            console.table(csvArray);
            setCSVArray(csvArray);
        }

        getAndSetCSVArray();
    }, [files]);

    const renderResults = () => {
        if (CSVArray) {
            if (reportStyle === 'trading212') {
                return <Trading212Report csv={CSVArray} />
            }
        } else {
            return <LoadingAnimation task="Generating CSV-Array"/>
        }
    }

    return (
        <div className="results">
            {renderResults()}
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
