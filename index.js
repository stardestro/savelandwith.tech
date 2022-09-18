const { Client, FileCreateTransaction, ContractFunctionParameters, ContractCreateTransaction, ContractExecuteTransaction, Hbar, ContractCallQuery, PrivateKey } = require("@hashgraph/sdk");
require("dotenv").config();

async function main() {

    //Grab your Hedera testnet account ID and private key from your .env file
    const myAccountId = process.env.MY_ACCOUNT_ID;
    const myPrivateKey = process.env.MY_PRIVATE_KEY;

    // If we weren't able to grab it, we should throw a new error
    if (myAccountId == null ||
        myPrivateKey == null ) {
        throw new Error("Environment variables myAccountId and myPrivateKey must be present");
    }
    const client = Client.forTestnet();

    client.setOperator(myAccountId, myPrivateKey);

    //Import the compiled contract from the HelloHedera.json file
    let Sourcez = require("./SourceContractNew.json");
    const bytecode = Sourcez.data.bytecode.object;

    //Create a file on Hedera and store the hex-encoded bytecode
    const fileCreateTx = new FileCreateTransaction()
            //Set the bytecode of the contract
            .setContents(bytecode);

    //Submit the file to the Hedera test network signing with the transaction fee payer key specified with the client
    const submitTx = await fileCreateTx.execute(client);

    //Get the receipt of the file create transaction
    const fileReceipt = await submitTx.getReceipt(client);

    //Get the file ID from the receipt
    const bytecodeFileId = fileReceipt.fileId;

    //Log the file ID
    console.log("The smart contract byte code file ID is " +bytecodeFileId)

    // Instantiate the contract instance
    const contractTx = await new ContractCreateTransaction()
        //Set the file ID of the Hedera file storing the bytecode
        .setBytecodeFileId(bytecodeFileId)
        //Set the gas to instantiate the contract
        .setGas(1000000)
        //Provide the constructor parameters for the contract
        // .setConstructorParameters(new ContractFunctionParameters().addInt104(12).addInt104(12).addInt104(-12).addInt104(-12));

    //Submit the transaction to the Hedera test network
    const contractResponse = await contractTx.execute(client);

    //Get the receipt of the file create transaction
    const contractReceipt = await contractResponse.getReceipt(client);

    //Get the smart contract ID
    const newContractId = contractReceipt.contractId;

    //Log the smart contract ID
    console.log("The smart contract ID is " + newContractId);

    const prompt = require("prompt-sync")({ sigint: true });
    const age = prompt("How much Hbar would you like to sell this plot? ");

    // //v2 JavaScript SDK
    //  //Create the transaction to update the contract message
    const contractExecTx = await new ContractExecuteTransaction()
        //Set the ID of the contract
        .setContractId(newContractId)
        //Set the gas for the contract call
        .setGas(100000)
        //Set the contract function to call
        .setFunction("set_price", new ContractFunctionParameters().addUint256(age));

    //Submit the transaction to a Hedera network and store the response
    const submitExecTx = await contractExecTx.execute(client);

    //Get the receipt of the transaction
    const receipt2 = await submitExecTx.getReceipt(client);

    //Confirm the transaction was executed successfully 
    console.log("The Price_set status is " +receipt2.status.toString());
}
main();