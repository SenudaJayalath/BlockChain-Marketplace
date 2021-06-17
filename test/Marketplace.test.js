const { assert } = require("chai")

const Marketplace =artifacts.require('Marketplace.sol')

contract('Marketplace',(accounts)=>{
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

    describe ('product', async ()=>{
        let result,productCount
        before( async ()=>{
            result = await marketplace.createProduct('iPhone X',web3.utils.toWei('1','Ether'))
            productCount= await marketplace.productCount()
        })
        it('create products', async ()=>{
            //SUCCESS
            assert.equal(productCount,1)
            console.log(result.logs)
        })
    })

})