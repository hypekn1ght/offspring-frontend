import React, { useState, useEffect } from 'react';
import Web3 from 'web3'
import './App.css';
import ScribblesABI from './scribbles.json'
import Offspring from './offspring.json'
import { CardWithStats } from './card.tsx';
import { Connect, Address } from './connectButton.js';
import { Grid } from '@mantine/core';

const App = () => {
  const offspringAddress = "0x16D376b32339CED0327875B931ab4D7F1Baecb98";
  const parentAddress = "0xDB18774dCa16F1c5C2F7Af640EBA3edb19343D7d";
  const [account, setAccount] = useState();
  
  //UI
  const [ID, setID] = useState();

  //parent scribbles states
  const [parentContract, setParentContract] = useState();
  const [scribbleSVG, setScribbleSVG] = useState();
  const [ownedParentID, setOwnedParentID] = useState();
  const [rentID, setRentID] = useState();
  const [NFTs, setNFTs] = useState();

  //offspring states
  const [offspringContract, setOffspringContract] = useState();
  const [offspringBalance, setOffspringBalance] = useState();
  const [offspringSupply, setOffspringSupply] = useState();
  const [mintTally, setMintTally] = useState();
  const [rentTally, setRentTally] = useState();
  

  useEffect(() => {
    loadWeb3();
    // initialise();
  }, []);

  useEffect(() => {
    console.log(NFTs);
  }, [NFTs]);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
      const accounts = await window.web3.eth.getAccounts()
      setAccount(accounts[0]);
      getOwnedParents();
      getOffspringData();
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
      const accounts = await window.web3.eth.getAccounts()
      setAccount(accounts[0]);
      getOwnedParents();
      getOffspringData();
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
    console.log("load web3 completed")
  };

  // const initialise = async() => {

  // }

  const getOwnedParents = async () => {
    setNFTs([]);
    window.web3 = new Web3(window.web3.currentProvider)
    const accounts = await window.web3.eth.getAccounts()
    const web3 = window.web3;
    console.log("account: " + accounts[0]);
    var chainID = await web3.eth.net.getId();
    if (chainID == 1666600000) {
      
      const parentContract = new web3.eth.Contract(ScribblesABI, parentAddress);
      setParentContract(parentContract);
      var data = []
      var count = await parentContract.methods.balanceOf(accounts[0]).call();
      console.log("count is : " + count);
      if (count) {
        for (let i = 0; i < count; i++) {
          let NFTIndex = await parentContract.methods.tokenOfOwnerByIndex(accounts[0], i).call();
          let NFTSVG = await parentContract.methods.tokenURI(NFTIndex).call();
          console.log(NFTIndex + ":" + NFTSVG);
          data.push({ index: NFTIndex, svg: NFTSVG });
        }
        setNFTs(data);
      }
    } else {
      window.alert('you are not on harmony mainnet, please choose the right network');
    }

  }

  const getRentScribbles = async (_parentIndex) => {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    setRentID(_parentIndex);

    const parentAddress = "0xDB18774dCa16F1c5C2F7Af640EBA3edb19343D7d"
    const networkId = await web3.eth.net.getId();
    console.log(networkId)
    const parentContract = new web3.eth.Contract(ScribblesABI, parentAddress)
    setParentContract(parentContract);
    var data = null
    console.log("parent index is : " + _parentIndex);
    if (_parentIndex) (
      data = await parentContract.methods.tokenURI(_parentIndex).call()
    )
    setScribbleSVG(data);
    console.log(data);
  };

  const mintOffspring = async () => {
    if (rentID == null || ownedParentID == null) {
      window.alert("no rented and/or owned parent specified!")
    } else {
      console.log("mint initiated");
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      let offspringABI = Offspring.abi;
      const offspringContract = new web3.eth.Contract(offspringABI, offspringAddress);
      offspringContract.methods.mint(1, ownedParentID, rentID).send({ from: accounts[0], value: 1000000000000000000 }).then(tx => {
        console.log(tx);
        console.log("minting successful");
      }).catch(err => {
        console.log(err);
        console.log("minting errored");
      });

    }
  };

  const getOffspringData = async () => {
    const accounts = await window.web3.eth.getAccounts();
    let offspringABI = Offspring.abi;
    const offspringContract = new window.web3.eth.Contract(offspringABI, offspringAddress);
    let offspringCount = await offspringContract.methods.balanceOf(accounts[0]).call();
    setOffspringBalance(offspringCount);
    let offspringSupply = await offspringContract.methods.totalSupply().call();
    setOffspringSupply(offspringSupply);
  }

  const selectParent = async (_index) => {
    console.log(_index);
    setOwnedParentID(_index);

    const offspringContract = new window.web3.eth.Contract(Offspring.abi, offspringAddress);
    let mintCounter = await offspringContract.methods.getMintCounter(_index).call();
    setMintTally(mintCounter);
    let rentCounter = await offspringContract.methods.getRentCounter(_index).call();
    setRentTally(rentCounter);
  }

  return (
    <div id="root">
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <ul className="navbar-nav px-3">
          scribbles
        </ul>
      </nav>
      <div className="container-fluid mt-5">
        <Grid gutter="lg">
          <Grid.Col span={5} offset={2}>
            <div>
              {
                account ? (
                  <Address userAddress={account} />
                ) : (
                  <Connect />
                )
              }
            </div>
          </Grid.Col>
          <Grid.Col span={3} >
            <div className="form mr-auto ml-auto">
              <form onSubmit={(event) => {
                event.preventDefault();
                getRentScribbles(ID);
              }}>
                <input
                  type='text'
                  className='form-control mb-1'
                  placeholder='e.g. 1, 1021 (MAX 1024)'
                  value={ID}
                  onChange={e => setID(e.target.value)}
                />
                <input
                  type='submit'
                  className='btn btn-block btn-primary'
                  value='RETRIEVE'
                />
              </form>
            </div>
          </Grid.Col>
        </Grid>
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">

            <div></div>
          </main>
        </div>
        <hr />
        <Grid gutter="lg">
          <Grid.Col span={6} offset={1}>
            <div>
              {
                NFTs ? NFTs.map(NFT => {
                  return (
                    <button className={ownedParentID==NFT.index?"selected":""} onClick={() => selectParent(NFT.index)}>
                      <CardWithStats title='Scribbles' description={NFT.index} image={NFT.svg} />
                    </button>
                  )
                }) : <div>No parent owned</div>
              }
            </div>
          </Grid.Col>
          <Grid.Col span={3} >
            <div>
              <CardWithStats title='Scribbles' description={rentID} image={scribbleSVG} />
              {/* <div className="row text-center">
              { this.state.colors.map((color, key) => {
                return(
                  <div key={key} className="col-md-3 mb-3">
                    <div className="token" style={{ backgroundColor: color }}></div>
                    <div>{color}</div>
                  </div>
                )
              })}
            </div> */}
              <button onClick={mintOffspring}>mint</button>
            </div>
          </Grid.Col>
        </Grid>
      </div>
      <div>
        <Grid gutter="lg">
          <Grid.Col span={6} offset={2}>
            <div>
              total supply
            </div>
            <div>
              {offspringSupply}
            </div>
            <div>
              mint tally
            </div>
            <div>
              {mintTally}
            </div>
            <div>
              rent tally
            </div>
            <div>
              {rentTally}
            </div>
          </Grid.Col>
          <Grid.Col span={3} >
            <div>
              <span className="offspring-field">owned</span>
            </div>
            <div>
              <span className="offspring-field">{offspringBalance}</span>
            </div>
          </Grid.Col>
        </Grid>
      </div>
    </div>
  );
}


export default App;
