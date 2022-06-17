import './styles/ErrorHandler.css';
import { useEffect } from 'react';
import { analytics } from './analytics/firebase';

function ErrorHandler({ error }) {

    useEffect(() => {
        analytics.log('error', {
            error: error,
        });
    });

    return (
        <div className="error-handler">
            <div className="wrapper">
                <div className="warning-symbol">&#128293;</div>
                <div className="text">
                    <div className="information">
                        An error occurred. Please create an issue <a href="https://github.com/martenmatrix/capital-gains-trading-calculator/issues">here</a> and include the error message below or refresh the page.
                    </div>
                    <div className="error">
                        <pre>{error.toString()}</pre>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ErrorHandler;