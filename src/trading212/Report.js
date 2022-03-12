import { useEffect, useState } from 'react';
import Trading212 from './transformer';
import FiFoReport from '../calculationsMethods/FiFoReport';

import { analytics } from '../analytics/firebase.js';

function Trading212Report(props) {
    const csv = props.csv;
    const [possibleYears, setPossibleYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');

    const [conversionFees, setConversionFees] = useState([]);
    const [currency, setCurrency] = useState();

    const [fifo, setFifo] = useState();
    const [fifoData, setFifoData] = useState();

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
        if (!fifo) return;
        analytics.log('calculate_year', { year: selectedYear, method: 'fifo' });

        setCurrentTask('Getting fees');
        const conversionFees = Trading212.getCurrencyConversionFees(selectedYear);
        setConversionFees(conversionFees);

        setCurrentTask('Getting profits');
        const data = fifo.getRealizedProfits(selectedYear);
        setFifoData(data)

        setCurrentTask(null);
    }, [fifo, selectedYear]);

    function handleYearSelection(eventKey) {
        const selectedYear = eventKey;
        setSelectedYear(selectedYear);
    }

    return <FiFoReport 
        handleYearSelection={handleYearSelection}
        currentTask={currentTask}
        selectedYear={selectedYear}
        years={possibleYears}
        fifoData={fifoData}
        currency={currency}
    />
}

export default Trading212Report;