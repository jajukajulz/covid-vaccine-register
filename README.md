# covid-vaccine-register
A blockchain-enabled COVID-19 register. This dApp illustrates how a credible COVID-19 register can be created on the blockchain - 
blockchain serves as a single source of credible truth and anyone (any authority, entrance marshall etc) can query the blockchain
 to see if a claimed vaccination ID is legitimate.

## Installation
Clone the project repository
```
git clone  https://github.com/jajukajulz/covid-vaccine-register.git
```

Install DB Browser for SQLite to graphically view db
```
Visit https://sqlitebrowser.org/
``` 

Install Ganache for local blockchain
```
Visit https://www.trufflesuite.com/ganache
``` 

Start Ganache and create an application workspace
```
Visit https://www.trufflesuite.com/tutorial
``` 
Install project dependencies
```
npm install
```

Compile and Deploy smart contract (located in contracts/VaccineRegistry) to Ganache. You can use the --reset flag to run all your migrations from the beginning. 
```
truffle compile

truffle migrate
```

Update the `vaccineRegisterContractAddress` in `/public/js/cvr_blockchain.js` with the address of the deployed contract.

## Usage
Run `npm run start`  and then access http://localhost:3000 in your web browser

Add a Vaccination Record via form

Add to Blockchain by 1st clicking on `Enable Blockchain/Connect to Wallet` then `Add to Blockchain` (you will need to approve transaction in MetaMask).
Open up `index.html` 

![Screenshot of landing page](https://github.com/jajukajulz/covid-vaccine-register/blob/main/public/img/covid_vaccine_register.png?raw=true)

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Attribution
Vaccination Register dApp may be used with attribution to source - Julian Kanjere (https://github.com/jajukajulz/)

## License
[MIT](https://choosealicense.com/licenses/mit/)
