import { useEffect, useState } from 'react';
import Trading212 from './transformer';
import LoadingAnimation from '../LoadingAnimation';
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import '../styles/trading212/Report.css';

import { analytics } from '../analytics/firebase.js';

function DonationBanner(props) {
    const showAfter = props.showAfter;
    const [isShown, setIsShown] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setIsShown(true);
        }, showAfter);
    }, [showAfter]);

    function hide(acceptedOffer) {
        analytics.log('donation_banner_interaction', { wantedToDonate: acceptedOffer });
        setIsShown(false);
    }

    if (isShown) return (
        <div className="donation-banner">
            <div className="wrapper">
                <div className="text">
                    If this tool saved you some time, consider making a small donation today, because maintaining and hosting this site creates costs. Every penny helps and 100% of your donation immediately goes into this project.
                </div>
                <div className="buttons">
                    <Button size="lg" variant="primary" onClick={() => hide(true)} href="https://www.paypal.com/donate/?hosted_button_id=HSPL5HCL7A6P6" target="_blank" rel="noopener">Donate now!</Button>
                    <Button size="lg" variant="danger" onClick={() => hide(false)}>No</Button>
                </div>
            </div>
        </div>
    );
    else return null;
}

function Statistics(props) {
    const year = props.year;
    const fifoData = props.fifoData;
    const round = (number) => Math.round(number * 1000) / 1000;
    const profit = round(fifoData.total);
    const income = round(fifoData.income);
    const loss = round(fifoData.loss);
    const conversionFees = props.conversionFees;
    const currency = props.currency;

    const madeLoss = (profit <= 0);

    return (
        <div className="statistics">
            <div className="information">
                The following results were calculated with the FiFo method.
            </div>
            <div className="profits">
                You made a {madeLoss ? 'loss' : 'profit'} of {`${Math.abs(profit)} ${currency}`} (fees excluded) in {year}. {madeLoss ? "I'm sorry. " : "Good job! "}
                Your profit consists of a loss of {`${Math.abs(loss)} ${currency}`} and an income of {`${Math.abs(income)} ${currency}`}.
            </div>
            <div className="fees">
                You paid a total of {`${conversionFees} ${currency}`} for conversion fees.
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

    function handleChange(eventKey) {
        const selectedYear = eventKey;
        setSelectedYear(selectedYear);
    }

    if (currentTask === null) {
        return (
            <div className="report">
                <DropdownButton name="years" title={selectedYear ? selectedYear : 'Select a year...'} onSelect={handleChange}>
                    {possibleYears.map(year => <Dropdown.Item eventKey={year} key={year}>{year}</Dropdown.Item>)}
                </DropdownButton>

                {selectedYear ? <Statistics year={selectedYear}
                                            conversionFees={conversionFees}
                                            fifoData={fifoData}
                                            currency={currency}/> : null}

                {selectedYear ? <DonationBanner showAfter={20000}/> : null}
            </div>
        )
    } else {
        return <LoadingAnimation task={currentTask}/>
    }
}

export default Trading212Report;