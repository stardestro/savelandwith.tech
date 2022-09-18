pragma solidity >=0.7.0 <0.8.9;


contract SourceContractNew {
    // the contract's owner, set in the constructor
    address creator;
    address payable public owner;

    // the message we're storing
    int public x1 = 12;
    int public y1 = 12;
    int public x2 = -12;
    int public y2 = -12;
    bool public buyable = true;
    uint public value = 1200;

    constructor(/*int x1start, int y1start, int x2start, int y2start*/) {
        // set the owner of the contract for `kill()`
        creator = msg.sender;
        owner = payable(msg.sender);
    }

    //Buy from owner
    function buy() public payable{
        //Check if buyable
        if(buyable == false) {
            revert('error not buyable');
        }
        //Check if payment is equal to value set
        if(msg.value != value){
            revert('error not correct value');
        }
        //transfer ownership
        owner.transfer(value);
        owner = payable(msg.sender);

    }

    //owner sets price
    function set_price(uint setprice) public {

        //Check if owner
        if (msg.sender != creator) return;

        //set price
        value = setprice;

    }

    //Owner set buyable
    function set_buyable(bool setbuyable) public {

        //Check if owner
        if (msg.sender != creator) return;

        //set buyable
        buyable = setbuyable;

    }

}