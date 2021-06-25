import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3';
import Marketplace from '../abis/Marketplace.json'
import Navbar
 from './Navbar';
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
      console.log(marketplace)
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
  }
  
  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={logo} className="App-logo" alt="logo" />
                </a>
                <h1>Dapp University Starter Kit</h1>
                <p>
                  Edit <code>src/components/App.js</code> and save to reload.
                </p>
                <a
                  className="App-link"
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LEARN BLOCKCHAIN <u><b>NOW! </b></u>
                </a>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
