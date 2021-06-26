import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3';
import Marketplace from '../abis/Marketplace.json'
import Navbar from './Navbar';
import Main from './Main';
class App extends Component {

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
  }
  async loadWeb3 (){
      // Modern dapp browsers...
      if (window.ethereum) {
          window.web3 = new Web3(window.ethereum);        
              // Request account access if needed
              await window.ethereum.enable();
      }
      // Legacy dapp browsers...
      else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider);
      }
      // Non-dapp browsers...
      else {
          console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
  }
  async loadBlockchainData(){
    const web3= window.web3
    //load account
    const accounts=await web3.eth.getAccounts()
    this.setState({account :accounts[0]})
    const networkId =await web3.eth.net.getId()
    const networkData= Marketplace.networks[networkId]
    if (networkData){
      const marketplace = web3.eth.Contract(Marketplace.abi,networkData.address)
      const productCount =await marketplace.methods.productCount().call()
      console.log(productCount.toString())
      this.setState({marketplace:marketplace})
      this.setState({loading:false})
    }else{
      window.alert("marketplace contract not deployed to detected network!")
    }
  }
  constructor(props){
    super(props)
    this.state={
      account:'',
      productCount:0,
      product:[],
      loading:true
    }
    this.createProduct= this.createProduct.bind(this)
  }
  createProduct(name,price){
    this.setState({loading:true})
    this.state.marketplace.methods.createProduct(name,price).send({from:this.state.account})
    .on('receipt',(receipt)=>{
      console.log("heyy")
      this.setState({loading:false})
     })
  }
  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              { this.state.loading 
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <Main createProduct={this.createProduct} />}
              
            </main>
          </div>
        </div>
        
      </div>
    );
  }
}

export default App;
