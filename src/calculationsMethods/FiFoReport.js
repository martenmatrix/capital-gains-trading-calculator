import { useEffect, useState } from 'react';
import { analytics } from '../analytics/firebase.js';
import Button from 'react-bootstrap/Button';
import LoadingAnimation from '../LoadingAnimation';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Table from 'react-bootstrap/Table'

import '../styles/FiFoReport.css';

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
                   Hosting and maintaining this projects creates costs. Please consider making a small donation, and I'll display your first name on the page. :)
                </div>
                <div className="buttons">
                    <Button size="lg" variant="primary" onClick={() => hide(true)} href="https://www.paypal.com/donate/?hosted_button_id=HSPL5HCL7A6P6" target="_blank" rel="noopener">Support &lt;3</Button>
                    <Button size="lg" variant="danger" onClick={() => hide(false)}>No :(</Button>
                </div>
            </div>
        </div>
    );
    else return null;
}

function StockTable({ stockArray }) {
    return (
      <Table>
          <thead>
          <tr>
              <th>Stock</th>
              <th>Profit</th>
          </tr>
          </thead>
          <tbody>
          {stockArray.map(stock => {
              return (
                <tr>
                    <td>{stock.symbol}</td>
                    <td>{stock.profit}</td>
                </tr>
              )
          })}
          </tbody>
      </Table>
    )
}

function Statistics(props) {
    const year = props.year;
    const fifoData = props.fifoData;
    const round = (number) => Math.round(number * 100) / 100;
    const profit = round(fifoData.total);
    const income = round(fifoData.income);
    const loss = round(fifoData.loss);
    const conversionFees = round(props.conversionFees);
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
            <div className="table">
                Below, you will see your profits for the year, broken down by stocks.
            </div>
            <StockTable stockArray={props.fifoData.stocks}/>
        </div>
    )
}

function BasicReport(props) {
    const handleYearSelection = props.handleYearSelection;
    const currentTask = props.currentTask;
    const selectedYear = props.selectedYear;
    const years = props.years;
    const fees = props.fees;
    const fifoData = props.fifoData;
    const currency = props.currency;
    
    if (currentTask === null) {
        return (
            <div className="report">
                <DropdownButton name="years" title={selectedYear ? selectedYear : 'Select a year...'} onSelect={handleYearSelection}>
                    {years.map(year => <Dropdown.Item eventKey={year} key={year}>{year}</Dropdown.Item>)}
                </DropdownButton>

                {selectedYear ? <Statistics year={selectedYear}
                                            conversionFees={fees}
                                            fifoData={fifoData}
                                            currency={currency}/> : null}

                {selectedYear ? <DonationBanner showAfter={20000}/> : null}
            </div>
        )
    } else {
        return <LoadingAnimation task={currentTask}/>
    }
}

export default BasicReport;