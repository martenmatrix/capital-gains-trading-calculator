import { useEffect, useState } from 'react';
import Revolut from "./transformer";
import FiFoReport from '../calculationsMethods/FiFoReport';

function RevolutReport(props) {
    const csvArray = props.csv;
    const [task, setTask] = useState(null);
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState();
    const [currency, setCurrency] = useState();

    const [fees, setFees] = useState();
    const [FiFoData, setFiFoData] = useState();

    useEffect(() => {
        setTask('Adding trading history')
        Revolut.addAction(undefined, ...csvArray);

        setTask('Getting possible years')
        const possibleYears = Revolut.getYears();
        setYears(possibleYears);

        setTask('Getting currency');
        const currency = Revolut.getCurrency();
        setCurrency(currency);

        setTask(null);
    }, [csvArray]);

    useEffect(() => {
        setTask('Getting fees');
        const fees = Revolut.getFees(selectedYear);
        setFees(fees);

        setTask('Calculating FiFo data');
        const FiFo = Revolut.getFiFo();
        const FiFoData = FiFo.getRealizedProfits(selectedYear);
        setFiFoData(FiFoData);

        setTask(null);
    }, [selectedYear]);

    function handleYearSelection(year) {
        setSelectedYear(year);
    }

    return <FiFoReport 
        handleYearSelection={handleYearSelection}
        currentTask={task}
        years={years}
        selectedYear={selectedYear}
        currency={currency}
        fifoData={FiFoData}
    />;
};

export default RevolutReport;
