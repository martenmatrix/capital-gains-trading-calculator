import { useEffect, useState } from 'react';
import Trading212 from './transformer';
import LoadingAnimation from '../LoadingAnimation';

function Statistics(props) {
    const year = props.year;
    const profit = props.profit;
    const conversionFees = props.conversionFees;
    const currency = props.currency;

    const madeLoss = (profit <= 0);

    return (
        <div className="statistics">
            <div className="information">
                The following results were calculated with the FiFo method.
            </div>
            <div className="fees">
                You paid a total of {`${conversionFees} ${currency}`} for conversion fees.
            </div>
            <div className="profits">
                You made a {madeLoss ? 'loss' : 'profit'} of {`${Math.abs(profit)} ${currency}`} (fees excluded) in {year}. {madeLoss ? "I'm sorry." : "Good job!"}
            </div>
        </div>
    )
}

function Trading212Report(props) {
    const csv = props.csv;
    const [possibleYears, setPossibleYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');

    const [conversionFees, setConversionFees] = useState([]);
    const [currency, setCurrency] = useState();

    const [, setFifo] = useState();

    const [currentTask, setCurrentTask] = useState(null);

    useEffect(() => {
        setCurrentTask('Adding actions');
        Trading212.addActions(csv);

        setCurrentTask('Calculating FiFo');
        const fifo = Trading212.calculateFiFo();
        setFifo(fifo);

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

        setCurrentTask('Getting profits');
        

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

                {selectedYear ? <Statistics year={selectedYear}
                                            conversionFees={conversionFees}
                                            profit={20}
                                            currency={currency}/> : null}

                <div className="donation">
                    {/* only show how results were calculated */}
                </div>
            </div>
        )
    } else {
        return <LoadingAnimation task={currentTask}/>
    }
}

export default Trading212Report;