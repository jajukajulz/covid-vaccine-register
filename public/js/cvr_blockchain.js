// this script contains the integration logic for the covid-vaccine-register node.js application to interact with
// the VaccineRegister solidity smart contract

//Basic Actions Section
const ethereumButton = document.querySelector(".enableEthereumButton");
const showAccount = document.querySelector(".showAccount");

// this function will be called when content in the DOM is loaded
const initialize = () => {
  /* A page can't be manipulated safely until the document is "ready." - jQuery detects this state of readiness. 
    Code included inside $(document).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript 
    code to execute. On the other hand, code included inside $(window).on( "load", function() { ... }) will run once the entire 
    page (images or iframes), not just the DOM, is ready. */
  //$(document).ready(function () {

  // Contract and Account Objects \\
  let accounts;
  let vaccineRegisterContractABI;
  let vaccineRegisterContractAddress;
  let vaccineRegisterContract;

  //------MetaMask Functions------\\

  // function to check if MetaMask is connected
  const isMetaMaskConnected = () => accounts && accounts.length > 0;

  // function to see if the MetaMask extension is installed
  const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window; // old school way was (typeof window.ethereum !== "undefined")
    console.log({ ethereum });
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  /* Link our Enable Ethereum Button from the index.ejs file to a function that verifies if the browser is running MetaMask 
  and asks user permission to access their accounts. You should only initiate a connection request in response to direct user action,
  such as clicking a button instead 
  of initiating a connection request on page load.
  */
  ethereumButton.addEventListener("click", () => {
    getAccount();
  });

  console.log("MetaMask is installed - " + isMetaMaskInstalled());

  /* "Connecting" or "logging in" to MetaMask effectively means "to access the user's 
  Ethereum account(s)". */
  async function getAccount() {
    // old school way of checking if metamask is installed
    if (typeof window.ethereum !== "undefined") {
      console.log("MetaMask is installed!");
      try {
        /* Ask user permission to access his accounts, this will open the MetaMask UI
                "Connecting" or "logging in" to MetaMask effectively means "to access the user's Ethereum account(s)".
                You should only initiate a connection request in response to direct user action, such as clicking a button. 
                You should always disable the "connect" button while the connection request is pending. You should never initiate a 
                connection request on page load.*/
        accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        showAccount.innerHTML = account;
        console.log(account || "Not able to get accounts");
        console.log(isMetaMaskConnected());
        if (isMetaMaskConnected()) {
          console.log("Metamask is connected :)");
        }
      } catch (err) {
        var message_description = "Access to your Ethereum account rejected.";

        //TODO - trigger pop up notification
        return console.log(message_description);
      }
    } else {
      console.log("Please install MetaMask");
    }
  }

  //------/MetaMask Functions------\\

  //------Contract Setup------\\

  /**
   * Contract Interactions
   */

  // in order to create a contract instance, we need the contract address and its ABI
  vaccineRegisterContractAddress = "0xa2e0B43a0F7c9eBCcF41d481D4F13027eC92E3fB";

  // the Application Binary interface (ABI) of the contract code is just a list of method signatures,
  // return types, members etc of the contract in a defined JSON format.
  // This ABI is needed when you will call your contract from a real javascript client e.g. a node.js web application.
  vaccineRegisterContractABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "_identity_number",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "_vaccination_id",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_submissionBlockNumber",
          "type": "uint256"
        }
      ],
      "name": "registeredVaccineRecordEvent",
      "type": "event"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "vaccine_records",
      "outputs": [
        {
          "internalType": "string",
          "name": "identity_number",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "name_details",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "vaccination_id",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "vaccination_details",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "string",
          "name": "_identity_number",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_name_details",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_vaccination_id",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_vaccination_details",
          "type": "string"
        }
      ],
      "name": "addVaccinationRecord",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getNumberOfVaccinationRecords",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ];

  // alternative to manually adding the ABI is to get it directly from the JSON file. This is actually the better way :)
  /* try {
            const data = await $.getJSON("../contracts/VaccineRegister.json");
            const netId = await web3.eth.net.getId();
            const deployedNetwork = data.networks[netId];
            const vaccineRegisterContract = new web3.eth.Contract(
            data.abi,
            deployedNetwork && deployedNetwork.address
            );
    } catch (err) {
        var message_description = "Error accessing contract JSON.";
        //TODO - trigger pop up notification
        return console.log(message_description);
    } */

  // The "any" network will allow spontaneous network changes
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

  provider.on("network", (newNetwork, oldNetwork) => {
    // When a Provider makes its initial connection, it emits a "network"
    // event with a null oldNetwork along with the newNetwork. So, if the
    // oldNetwork exists, it represents a changing network
    if (oldNetwork) {
      window.location.reload();
    }
  });

  console.log({ provider });

  // The Metamask plugin also allows signing transactions to send ether and
  // pay to change state within the blockchain. For this, we need the account signer
  const signer = provider.getSigner();

  // the contract object
  vaccineRegisterContract = new ethers.Contract(
      vaccineRegisterContractAddress,
      vaccineRegisterContractABI,
      signer
  );

  //------/Contract Setup------\\

  //------UI Click Event Handlers------\\

  // trigger smart contract call to addVaccinationRecordToBlockchain() function on UI button click
  $(".addUserToBlockchainBtn").click(addVaccinationRecordToBlockchain);

  //------/UI Click Event Handlers------\\

  //------Custom Error Handlers------\\

  //function to handle error from smart contract call
  function handle_error(err) {
    console.log("function handle_error(err).");
    var error_data = err.data;
    var message_description = "Vaccine Register Smart contract call failed: " + err;
    if (typeof error_data !== "undefined") {
      var error_message = error_data.message;
      if (typeof error_message !== "undefined") {
        message_description =
          "Vaccine Register smart contract call failed: " + error_message;
      }
    }

    // TODO - trigger  notification
    return console.log(message_description);
  }

  //function to handle web 3 undefined error from smart contract call
  function handle_web3_undefined_error() {
    console.log("function handle_web3_undefined_error(err).");
    var message_description =
      "Please install MetaMask to access the Ethereum Web3 injected API from your Web browser.";

    //TODO - trigger notification
    return console.log(message_description);
  }

  //------/Custom Error Handlers------\\

  //------Blockchain and Smart Contract Function Calls------\\

  // function Add to Blockchain
  async function addVaccinationRecordToBlockchain() {
    $(this).addClass("disabled");
    // add spinner to button
    $(this)
      .html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 
        Adding to Blockchain...`);

    //vaccine record form data
    var identity_number = $(this).data("identity_number");
    var first_name = $(this).data("first_name");
    var last_name = $(this).data("last_name");
    var vaccination_id = $(this).data("vaccination_id");
    var vaccination_date = $(this).data("vaccination_date");
    var vaccine_name = $(this).data("vaccine_name");
    var vaccine_place = $(this).data("vaccine_place");

    const name_details = first_name + " " + last_name;
    const vaccination_details = vaccination_date + " " + vaccine_name + " " + vaccine_place;

    console.log("identity_number to add to blockchain - " + identity_number);
    console.log("first_name to add to blockchain - " + first_name);
    console.log("last_name to add to blockchain - " + last_name);
    console.log("vaccination_id to add to blockchain - " + vaccination_id);
    console.log("vaccination_date to add to blockchain - " + vaccination_date);
    console.log("vaccine_name to add to blockchain - " + vaccine_name);
    console.log("vaccine_place to add to blockchain - " + vaccine_place);

    console.log("name_details to add to blockchain - " + name_details);
    console.log("vaccination_details to add to blockchain - " + vaccination_details);

    // VaccineRegistry smart contract
    // function addVaccinationRecord(string calldata _identity_number, string calldata _name_details,
    //     string calldata _vaccination_id, string calldata _vaccination_details) external returns(uint

    if (typeof web3 === "undefined") {
      return handle_web3_undefined_error();
    }

    try {
      const transaction = await vaccineRegisterContract.addVaccinationRecord(identity_number, name_details,
          vaccination_id, vaccination_details);
      const data = await transaction.wait();
      console.log("data: ", data);
      console.log("tx details:", transaction)
    } catch (err) {
      console.log("Error: ", err);
    }
    var message_description = `Transaction submitted to Blockchain for processing. Check your Metamask for transaction update.`;

    //TODO - trigger notification
    console.log(message_description);
  }

  // function to get count of vaccination records that have been previously added to the blockchain
  function getNumberOfVaccinationRecordsCount() {
    if (typeof web3 === "undefined") {
      return handle_web3_undefined_error();
    }

    vaccineRegisterContract.getNumberOfVaccinationRecords(function (err, result) {
      if (err) {
        return handle_error(err);
      }

      let vaccineRecordsSubmissionsCount = result.toNumber(); // Output from the contract function call
      console.log("getNumberOfVaccinationRecords: " + vaccineRecordsSubmissionsCount);
      var message_description = `Number of vaccination records in VaccineRegistry: + ${vaccineRecordsSubmissionsCount}`;
      // TODO - trigger notification
      return console.log(message_description);
    });
  }

  //------Watch for Blockchain and Smart Contract Events------\\

  //Watch for registeredVaccineRecordEvent, returns  _identity_number, _vaccination_id, submissionBlockNumber
  vaccineRegisterContract.on(
    "registeredVaccineRecordEvent",
    (identity_number, vaccination_id, submissionBlockNumber, event) => {
      console.log("registeredVaccineRecordEvent");
      console.log("First parameter identity_number:", identity_number);
      console.log("Second parameter vaccination_id:", vaccination_id);
      console.log(
        "Third parameter submissionBlockNumber:",
        submissionBlockNumber
      );
      console.log("Event : ", event); //Event object
      updateAddBlockchainBtn(vaccination_id); //Update UI Button to stop spinning
      // TODO - Update status in DB via ajax post then update UI button
    }
  );

  //------/Watch for Blockchain and Smart Contract Events------\\

  //------AJAX Calls------\\
  function updateAddBlockchainBtn(unique_id) {
    const addToBlockchainBtnID = "#add_blockchain_" + unique_id;
    const addToBlockchainBtn = $(addToBlockchainBtnID);
    console.log(addToBlockchainBtn);

    // remove spinner from button
    addToBlockchainBtn.removeClass("spinner-border");
    addToBlockchainBtn.removeClass("spinner-spinner-border-sm");
    addToBlockchainBtn.html("Added to Blockchain...");
    console.log("AddBlockchainBtn updated for vaccinee with vaccine ID  " + unique_id);
  }
  //------/AJAX Calls------\\
};

// As soon as the content in the DOM is loaded we are calling our initialize function
window.addEventListener("DOMContentLoaded", initialize);
