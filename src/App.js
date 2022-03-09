import { useEffect, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Trading212 } from './trading212';
import { getFileAsText, mergeCSV, csvTextToArray } from './misc';
import './App.css';
import './loadingAnimation.css';

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
            <p>✨ Read the text below and drop your CSV file here or <u>click here</u> to select them.</p>
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

function LoadingAnimation(props) {
    const task = props.task;

    return (
        <>
            <div className="lds-ripple"><div></div><div></div></div>
            <p>This may take some time. <br/> Do not refresh the page. <br /> <br /> &#8987; {task}...</p>
        </>
    )
}

function Trading212Report(props) {
    const csv = props.csv;
    const [possibleYears, setPossibleYears] = useState([]);
    const [currentTask, setCurrentTask] = useState(null);
    const [reportData, setReportData] = useState({
        realizedProfit: null,
        currencyExchangeFees: null,
    });
    const [selectedYear, setSelectedYear] = useState([]);

    useEffect(() => {
        setCurrentTask('Adding actions');
        Trading212.addActions(csv);
        const possYears = Trading212.getPossibleYears();

        setCurrentTask('Getting possible years');
        setPossibleYears(possYears);

        setCurrentTask(null);
    }, [csv])

    useEffect(() => {
        
    }, [selectedYear]);

    if (currentTask === null) {
        return (
            <div className="report">
                <select name="years">
                    {possibleYears.map(year => <option value={year} key={year}>{year}</option>)}
                </select>
            </div>
        )
    } else {
        return <LoadingAnimation task={currentTask}/>
    }
}

function Report(props) {
    const[CSVArray, setCSVArray] = useState(null);
    const files = props.files;
    const reportStyle = 'trading212';

    async function getArray() {
        const csvs = [];

        await Promise.all(files.map(async (file) => {
            const text = await getFileAsText(file);
            const csvArray = csvTextToArray(text);
            csvs.push(csvArray);
        }));

        const csvArray = mergeCSV(csvs);
        console.table(csvArray);
        return csvArray;
    }

    useEffect(() => {
        async function getCSVArray() {
            const csvArray = await getArray();
            setCSVArray(csvArray);
        }
        getCSVArray();
    }, []);

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
