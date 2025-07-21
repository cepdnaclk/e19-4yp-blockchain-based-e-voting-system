package main

import (
	"encoding/json"
	"fmt"
	"bytes"
	"strconv"
	"time"

	"github.com/hyperledger/fabric-chaincode-go/shim"
	sc "github.com/hyperledger/fabric-protos-go/peer"
	"github.com/hyperledger/fabric/common/flogging"
)

// SmartContract defines the structure for the voting chaincode
// This contract manages vote hashes and their history on the blockchain
// All voting actions are recorded immutably
//
type SmartContract struct {
}

// Data structure for storing key-value pairs (e.g., vote hashes)
type Data struct {
	Key   string `json:"key"`
	Value  string `json:"value"`
}

// Init initializes the smart contract (runs once when chaincode is instantiated)
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

var logger = flogging.MustGetLogger("chainVote_cc")

// Invoke routes function calls to the appropriate handler
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	function, args := APIstub.GetFunctionAndParameters()
	logger.Infof("Function name is:  %d", function)
	logger.Infof("Args length is : %d", len(args))

	switch function {
	case "initLedger":
		return s.initLedger(APIstub)
	case "getHash":
		return s.getHash(APIstub, args)
	case "postHash":
		return s.postHash(APIstub, args)
	case "putHash":
		return s.putHash(APIstub, args)
	case "getHistory":
		return s.getHistory(APIstub, args)
	default:
		return shim.Error("Invalid Smart Contract function name.")
	}
}

// Initializes the ledger (can be used to set up initial state)
func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	logger.Info("Initializing ledger")
	return shim.Success([]byte("Ledger initialized successfully"))
}

// Retrieves the value for a given key (e.g., vote hash)
func (s *SmartContract) getHash(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	res, _ := APIstub.GetState(args[0])
	return shim.Success(res)
}

// Stores a new key-value pair (e.g., a new vote hash)
func (s *SmartContract) postHash(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	var data = Data{Key: args[0], Value: args[1]}

	dataAsBytes, _ := json.Marshal(data)
	APIstub.PutState(args[0], dataAsBytes)
	return shim.Success(dataAsBytes)
}

// Updates the value for an existing key (e.g., update a vote hash)
func (s *SmartContract) putHash(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	dataAsBytes, _ := APIstub.GetState(args[0])
	data := Data{}

	json.Unmarshal(dataAsBytes, &data)
	data.Value = args[1]

	dataAsBytes, _ = json.Marshal(data)
	APIstub.PutState(args[0], dataAsBytes)

	return shim.Success(dataAsBytes)
}

// Retrieves the full history for a given key (audit trail for a vote hash)
func (t *SmartContract) getHistory(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	queryKey := args[0]

	resultsIterator, err := APIstub.GetHistoryForKey(queryKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing historic values for the marble
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"txId\":")
		buffer.WriteString("\"")
		buffer.WriteString(response.TxId)
		buffer.WriteString("\"")

		var val Data
		json.Unmarshal(response.Value, &val)
		valueJson, _ := json.Marshal(val.Value)	
		
		buffer.WriteString(", \"key\":")
		buffer.WriteString("\"")
		buffer.WriteString(val.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"value\":")
		buffer.WriteString(string(valueJson))

		buffer.WriteString(", \"timestamp\":")
		buffer.WriteString("\"")
		buffer.WriteString(time.Unix(response.Timestamp.Seconds, int64(response.Timestamp.Nanos)).String())
		buffer.WriteString("\"")

		buffer.WriteString(", \"isDelete\":")
		buffer.WriteString("\"")
		buffer.WriteString(strconv.FormatBool(response.IsDelete))
		buffer.WriteString("\"")

		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	// fmt.Printf("Get history returning:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

// The main function starts the chaincode in the Hyperledger Fabric network
func main() {

	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}
