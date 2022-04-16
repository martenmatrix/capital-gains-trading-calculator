# Capital Gains Calculator for CSV's

This application generates a report of incomes and losses from CSV-Data.
It currently supports the calculation of profits with the FiFo method for the platforms **Trading212** and **Revolut**. It is also able to calculate the fees paid for currency conversions.

## Table of Contents
- [Deployed links](#globe_with_meridians-deployed-links)
- [Usage](#grey_exclamation-usage)
	- [Trading212](#trading212)
	- [Revolut](#revolut)
- [Features](#sparkles-features)
- [Installation](#wrench-installation)
- [Technology stack](#blue_book-technology-stack)
- [License](#scroll-license)

## :globe_with_meridians: Deployed links

The application is hosted at the following addresses:

- https://trading-csv-fifo-calculator.web.app/
- https://trading-csv-fifo-calculator.firebaseapp.com/

## :grey_exclamation: Usage

1. #### Trading212
	Download your history as described [here](https://helpcentre.trading212.com/hc/en-us/articles/360016898917-Can-I-export-the-trading-data-from-my-account-). The file downloaded should end with `.csv`. Note that Trading212 currently only allows you to download your history in 12 month timeframes. If you've traded for more than 12 months, just download every single year as a seperate file.

	#### Revolut
	>:warning: **Currently only XAU/XAG assets are supported.**

	Download the CSV files from your Revolut app (Hub > Commodities > Select Silver or Gold > Statment). Select the maximum possible timeframe.
2. The application will automatically detect from which platform the files are. However, don't mix files from Revolut with files from Trading212 and vice versa.
3. Select all files you've downloaded **at once** and upload them. Hold `CTRL`, while clicking files to select multiple. If you've uploaded Revolut files, you'll need to enter some missing data, which you can find in your app.
4. If everything went fine, you should now be able to select a year. :tada:
If not, please [create an issue](https://github.com/martenmatrix/capital-gains-trading-calculator/issues/new).

## :sparkles: Features
- automatically detects origin of CSV
- calculate conversion fees in specific timeframe
- calculate realized incomes and losses with the first-in first-out method in specific timeframe

## :wrench: Installation
If you want to run the application on your local pc or just want to contribute, do the following steps:
1. Clone the repository.
`git clone https://github.com/martenmatrix/capital-gains-trading-calculator`
2. Install the dependencies.
`npm install`
3. If you want to run the website on your localhost type:
`npm run start`

## :blue_book: Technology Stack

- **Create React App** v5.0.0
- **Jest** v27.5.1
- **Bootstrap** v5.1.3
- **Firebase** (Hosting) v9.6.8

## :scroll: License
[MIT](https://github.com/martenmatrix/capital-gains-trading-calculator/blob/master/LICENSE)
