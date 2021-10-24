import './App.css';
import { useState, useEffect } from "react";
import Web3 from "web3";

function App() {

  const CONTRACT_ADDRESS = "0x55f10FEA1F783a1c532541a6209762E3aE490A2D";
  const CONTRACT_ABI = [{"inputs":[{"internalType":"uint256","name":"catOrDog","type":"uint256"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"winner","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}];

  useEffect(() => {
    async function init() {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }); 

        console.log("accounts: ", accounts);
        window.web3 = new Web3(window.ethereum);
        setUserAddress(accounts[0]);
        const contract = await new window.web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        console.log("contract: ", contract);
        setContract(contract);

        //fetching winner
        const winnerCatOrDog = await contract.methods.winner().call();
        setWinner(winnerCatOrDog); 
      }
      catch(err) {

      }
    }

    init();
  }, []);

  const [userAddress, setUserAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const [winner, setWinner] = useState(null);

  async function vote(num) {
    try {
      const ticket = await contract.methods.vote([num]).send({ from: userAddress, gas: "1000000" })
      const winnerCatOrDog = await contract.methods.winner().call();
      setWinner(winnerCatOrDog);
      console.log("ticket: ", ticket)
    }
    catch(err) {

    }
  }

  return (
    <div className="wrapper">
      <header>
        <h1> Voting Contract </h1>
        <h1>{ userAddress }</h1>
      </header>
      <div className="voting-buttons">
        <button onClick={() => vote(0)}>Cat</button>
        <button onClick={() => vote(1)}>Dog</button>
      </div>

      {/* display the winner */}

      <div className="winner">
        <h1> Winner: { winner }</h1>
      </div>
    </div>
  );
}

export default App;
