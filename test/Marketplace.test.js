const { assert } = require("chai")

require('chai')
    .use(require('chai-as-promised'))
    .should()

const Marketplace =artifacts.require('Marketplace.sol')

contract('Marketplace',([deployer,seller,buyer])=>{
    let marketplace

    before( async () => {
        marketplace =await Marketplace.deployed()
    })

    describe ('deployment', async ()=>{
        it('deploys successfully', async ()=>{
            const address =await marketplace.address
            assert.notEqual(address,0x0)
            assert.notEqual(address,'')
            assert.notEqual(address,null)
            assert.notEqual(address,undefined)
        })
        it('has a name', async ()=>{
            const name =await marketplace.name()
            assert.equal(name,'Dapp University Marketplace')
        })
    })

    describe('product', async ()=>{
        let result,productCount
        before( async ()=>{
            result = await marketplace.createProduct('iPhone X',web3.utils.toWei('1','Ether'),{from: seller})
            productCount= await marketplace.productCount()
        })
        it('create products', async ()=>{
            //SUCCESS
            assert.equal(productCount,1)
            const event =result.logs[0].args
            assert.equal(event.id.toNumber(),productCount.toNumber(),'id is correct')
            assert.equal(event.name ,'iPhone X')
            assert.equal(event.price ,'1000000000000000000')
            assert.equal(event.owner ,seller)
            assert.equal(event.purchased ,false)

            //FAILURES

            await marketplace.createProduct('',web3.utils.toWei('1','Ether'),{from: seller}).should.be.rejected
            await marketplace.createProduct('iPhone X','',{from: seller}).should.be.rejected
        })

        it('lists products', async ()=>{
            const product =await marketplace.products(productCount)
            assert.equal(product.id.toNumber(),productCount.toNumber(),'id is correct')
            assert.equal(product.name ,'iPhone X')
            assert.equal(product.price ,'1000000000000000000')
            assert.equal(product.owner ,seller)
            assert.equal(product.purchased ,false)
        })
        it('sells products', async ()=>{
            // Track seller balance before puchase
            let oldSellerBalance
            oldSellerBalance = await web3.eth.getBalance(seller)
            //console.log(oldSellerBalance)
            oldSellerBalance =new   web3.utils.toBN(oldSellerBalance)
            //console.log(oldSellerBalance)

            const result =await marketplace.purchaseProduct(productCount,{from:buyer, value: web3.utils.toWei('1','Ether')})
            // check logs
            const event =result.logs[0].args
            assert.equal(event.id.toNumber(),productCount.toNumber(),'id is correct')
            assert.equal(event.name ,'iPhone X')
            assert.equal(event.price ,'1000000000000000000')
            assert.equal(event.owner ,buyer)
            assert.equal(event.purchased ,true)

            // check the  seller receivenewSellerBalance
            let newSellerBalance
            newSellerBalance = await web3.eth.getBalance(seller)
            newSellerBalance =new web3.utils.toBN(newSellerBalance)

            let price

            price= web3.utils.toWei('1','Ether')
            price = new web3.utils.toBN(price)

            const expectedBalance   = oldSellerBalance.add(price)
            assert.equal(newSellerBalance.toString(),expectedBalance.toString())
        
            // Failurs

            await marketplace.purchaseProduct(99,{from: buyer, value:web3.utils.toWei('1','Ether')}).should.be.rejected
            await marketplace.purchaseProduct(productCount,{from: buyer, value:web3.utils.toWei('0.5','Ether')}).should.be.rejected
            await marketplace.purchaseProduct(productCount,{from: seller, value:web3.utils.toWei('1','Ether')}).should.be.rejected

        })
    })

})