pragma solidity ^0.5.0;

//Like the file name
contract Marketplace {
    string public name;
    uint256 public productCount = 0;
    mapping(uint256 => Product) public products;

    struct Product {
        uint256 id;
        string name;
        uint256 price;
        address owner;
        bool purchased;
    }

    event ProductCreated(
        uint256 id,
        string name,
        uint256 price,
        address owner,
        bool purchased
    );

    constructor() public {
        name = "Dapp University Marketplace";
    }

    function createProduct(string memory _name, uint256 _price) public {
        // Make sure the paramaeters are correct
        require(bytes(_name).length > 0);
        require(_price > 0);
        //Increment product count
        productCount++;
        // Create the product
        products[productCount] = Product(
            productCount,
            _name,
            _price,
            msg.sender,
            false
        );
        // Trigger an event
        emit ProductCreated(productCount, _name, _price, msg.sender, false);
    }

    function purchaseProduct(uint256 _id) public {
        //Fetch the product
        Product memory _product = products[_id];
        //Fetch the owner
        address _seller = _product.owner;
        //Make sure the product is valid
        //Transfer ownership
        _product.owner = msg.sender;
        //Mark as purchased
        _product.purchased = true;
        //Update the product
        products[_id] = _product;
        //Pay the seller by sending Ether

        //Trigger an event
    }
}
