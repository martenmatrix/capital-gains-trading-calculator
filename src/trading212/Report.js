import { useEffect, useState } from 'react';
import Trading212 from './transformer';
import LoadingAnimation from '../LoadingAnimation';

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
        console.log(Trading212.getFiFo());

        setCurrentTask('Getting possible years');

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

export default Trading212Report;