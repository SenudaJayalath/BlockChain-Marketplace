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
        address payable owner;
        // bool purchased;
    }

    event ProductCreated(
        uint256 id,
        string name,
        uint256 price,
        address payable owner
    );
    event ProductPurchased(
        uint256 id,
        string name,
        uint256 price,
        address payable owner
    );

    constructor() public {
        name = "BlockChain Marketplace";
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
            msg.sender
        );
        // Trigger an event
        emit ProductCreated(productCount, _name, _price, msg.sender);
    }

    function purchaseProduct(uint256 _id) public payable {
        //Fetch the product
        Product memory _product = products[_id];
        //Fetch the owner
        address payable _seller = _product.owner;
        //Make sure the product is valid
        require(_id > 0 && _id <= productCount);
        // //Require that there is enough ether sent in trnasaction
        require(msg.value >= _product.price);
        // // Require the product is not purchased
        //require(!_product.purchased);
        // //Require that the buyer is not the seller
        require(_seller != msg.sender);
        //Transfer ownership
        _product.owner = msg.sender;
        //Mark as purchased
        //_product.purchased = true;
        //Update the product
        products[_id] = _product;
        //Pay the seller by sending Ether
        address(_seller).transfer(msg.value);
        //Trigger an event
        emit ProductPurchased(
            productCount,
            _product.name,
            _product.price,
            msg.sender
        );
    }
}
