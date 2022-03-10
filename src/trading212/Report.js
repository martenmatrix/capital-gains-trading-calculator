import { useEffect, useState } from 'react';
import Trading212 from './transformer';
import LoadingAnimation from '../LoadingAnimation';

function Trading212Report(props) {
    const csv = props.csv;
    const [possibleYears, setPossibleYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');

    const [conversionFees, setConversionFees] = useState([]);
    const [currency, setCurrency] = useState();

    const [currentTask, setCurrentTask] = useState(null);

    useEffect(() => {
        setCurrentTask('Adding actions');
        Trading212.addActions(csv);

        setCurrentTask('Calculating FiFo');
        Trading212.calculateFiFo();

        setCurrentTask('Getting years');
        const years = Trading212.getYears();
        setPossibleYears(years);

        setCurrentTask('Getting currency');
        const currency = Trading212.getCurrency();
        setCurrency(currency);

        setCurrentTask(null);
    }, [csv])

    useEffect(() => {
        setCurrentTask('Getting fees');
        const conversionFees = Trading212.getCurrencyConversionFees(selectedYear);
        setConversionFees(conversionFees);
        setCurrentTask(null);
    }, [selectedYear]);

    function handleChange(e) {
        const selectedYear = e.target.value;
        setSelectedYear(selectedYear);
    }

    if (currentTask === null) {
        return (
            <div className="report">
                <select name="years" value={selectedYear} onChange={handleChange}>
                    <option value="" hidden disabled>Select a year...</option>
                    {possibleYears.map(year => <option value={year} key={year}>{year}</option>)}
                </select>
            </div>
        )
    } else {
        return <LoadingAnimation task={currentTask}/>
    }
}

export default Trading212Report;