import { useEffect, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { getFileAsText, mergeCSV, csvTextToArray } from './misc';
import LoadingAnimation from './LoadingAnimation';
import './styles/App.css';

// Reports
import Trading212Report from './trading212/Report';
import RevolutReport from './revolut/Report';

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
            <p>✨ Read the text below and drop your CSV files here or <u>click here</u> to select them. ✨</p>
        }
      </div>
    )
}

function InformationBanner() {
    return (
        <div className="information-banner">
            <div className="text">
            Create a CSV file from Trading 212 like <a href="https://helpcentre.trading212.com/hc/en-us/articles/360016898917-Can-I-export-the-trading-data-from-my-account-" target="_blank" rel="noreferrer">this</a>. Export your whole trading history in 12 months CSV's and drop/select them all at once. All uploaded files stay on your PC. You can find the code of this application or report issues and suggestions <a href="https://github.com/martenmatrix/trading212-tax-generator" target="_blank" rel="noreferrer">here</a> or <a href="mailto:01feature-toffee@icloud.com" target="_blank" rel="noreferrer">just write me a mail!</a>.
            </div>
        </div>
    )
}

function getReportStyle(CSVArray) {
    const keys = Object.keys(CSVArray[0]);
    const revolutKeys = [ "Type", "Product", "Started Date", "Completed Date", "Description", "Amount", "Fee", "Currency", "State", "Balance" ];
    const trading212Keys = [ "Action", "Time", "ISIN", "Ticker", "Name", "No. of shares", "Price / share", "Currency (Price / share)", "Exchange rate", "Result (EUR)", "Total (EUR)", "Charge amount (EUR)", "Stamp duty reserve tax (EUR)", "Notes", "ID", "Currency conversion fee (EUR)" ];
    
    const getNumberOfSameItems = (array1, array2) => {
        const matches = array1.filter((entry) => {
            return array2.includes(entry);
        });

        return matches.length;
    }

    const reportStyles = [{
        type: 'revolut',
        keys: revolutKeys
    }, {
        type: 'trading212',
        keys: trading212Keys
    }];

    const selectedStyle = reportStyles.reduce((oldReport, newReport) => {
        const matches = getNumberOfSameItems(keys, newReport.keys);
        if (matches > oldReport.matches) {
            return { ...newReport, matches }
        } else {
            return oldReport;
        }

    }, { matches: 0 });

    console.log(`Auto-select ${selectedStyle.type} as style for report`);
    return selectedStyle.type;
}

function Report(props) {
    const[CSVArray, setCSVArray] = useState(null);
    const files = props.files;
    const [reportStyle, setReportStyle] = useState();

    useEffect(() => {
        async function getAndSetCSVArray() {
            const csvs = [];
    
            await Promise.all(files.map(async (file) => {
                const text = await getFileAsText(file);
                const csvArray = csvTextToArray(text);
                csvs.push(csvArray);
            }));
    
            const csvArray = mergeCSV(csvs);
            console.log(csvArray);
            console.table(csvArray);
            setCSVArray(csvArray);
        }

        getAndSetCSVArray();
    }, [files]);


    useEffect(() => {
        if (CSVArray) {
            const reportStyle = getReportStyle(CSVArray);
            setReportStyle(reportStyle);
        }
    }, [CSVArray])

    const renderResults = () => {
        if (CSVArray && reportStyle) {
            if (reportStyle === 'trading212') {
                return <Trading212Report csv={CSVArray} />
            } else if (reportStyle === 'revolut') {
                return <RevolutReport csv={CSVArray} />
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
