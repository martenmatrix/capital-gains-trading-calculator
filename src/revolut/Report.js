import { useEffect, useState } from 'react';
import Revolut from "./transformer";
import FiFoReport from '../calculationsMethods/FiFoReport';

function RevolutReport(props) {
    const csvArray = props.csv;
    const [task, setTask] = useState(null);
    const [years, setYears] = useState([]);
    const [currency, setCurrency] = useState();

    useEffect(() => {
        setTask('Adding trading history')
        Revolut.addAction(...csvArray);

        setTask('Getting possible years')
        const possibleYears = Revolut.getYears();
        setYears(possibleYears);

        setTask('Getting currency');
        const currency = Revolut.getCurrency();
        setCurrency(currency);

        setTask(null);
    }, [csvArray]);

    function handleYearSelection(year) {

    }

    return <FiFoReport 
        handleYearSelection={handleYearSelection}
        currentTask={task}
        years={years}
        currency={currency}
    />;
};

export default RevolutReport;
