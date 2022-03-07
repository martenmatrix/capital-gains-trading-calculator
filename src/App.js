import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import './App.css';

function FileInput(props) {
    const [file, setFile] = props.fileState;

    const onDrop = useCallback(acceptedFile => {
      setFile(acceptedFile);
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, accept: '.csv', multiple: false})
  
    return (
      <div className="file-input" {...getRootProps()}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the files here ...</p> :
            <p>Read the text below (Please) and drop your CSV file here or <u>click here</u> to select it.</p>
        }
      </div>
    )
}

function InformationBanner() {
    return (
        <div className="information-banner">
            <div className="text">
            Create a CSV file from Trading 212 like <a href="https://helpcentre.trading212.com/hc/en-us/articles/360016898917-Can-I-export-the-trading-data-from-my-account-" target="_blank" rel="noreferrer">this</a>. Make sure you export the <i>maximum</i> possible time frame.
                All uploaded files stay on your PC. You can find the code of this application <a href="#" target="_blank" rel="noreferrer">here</a>.
            </div>
        </div>
    )
}

function App() {
    const [file, setFile] = useState(false);

    return (
        <div className="App">
            {file ? null : <FileInput fileState={[file, setFile]} />}
            <InformationBanner />
        </div>
    );
}

export default App;
