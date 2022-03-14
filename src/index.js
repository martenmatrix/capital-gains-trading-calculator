import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ErrorBoundary } from 'react-error-boundary'; // error boundaries currently only work in class components, thus the dependency
import ErrorHandler from './ErrorHandler';

ReactDOM.render(
    <React.StrictMode>
        <ErrorBoundary FallbackComponent={ErrorHandler}>
            <App />
        </ErrorBoundary>
    </React.StrictMode>,
    document.getElementById('root')
);