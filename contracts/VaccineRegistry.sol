pragma solidity ^0.5.0;

contract VaccineRegistry {

  // define the struct VaccineRecord
  struct VaccineRecord {
    string identity_number;
    string name_details; // first_name, last_name
    string vaccination_id;
    string vaccination_details; // vaccination_date, vaccine_name, vaccine_place
  }
  
  // event fired on submission of a VaccineRecord entry.
  event registeredVaccineRecordEvent (
    string _identity_number,
    string _vaccination_id,
    uint _submissionBlockNumber
  );
  
  // define the array of vaccine records i.e. vaccinees
  VaccineRecord[] public vaccine_records;

  function addVaccinationRecord(string calldata _identity_number, string calldata _name_details,
    string calldata _vaccination_id, string calldata _vaccination_details) external returns(uint){

    uint256 submissionBlockNumber = block.number;

    // get an instance of a VaccineRecord using the input variables and push into the array of vaccine_records, returns the id
    uint id = vaccine_records.push(VaccineRecord(_identity_number, _name_details, _vaccination_id, _vaccination_details)) - 1;

    // trigger event for VaccineRecord registration
    emit registeredVaccineRecordEvent(_identity_number, _vaccination_id, submissionBlockNumber);
    
    // return the vaccinee id
    return id;
  }

  function getNumberOfVaccinationRecords() external view returns(uint) {
    // return the length of the vaccine_records array
    return vaccine_records.length;
  }

}