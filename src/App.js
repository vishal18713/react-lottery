import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import abi from './abi.json';

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [newEntryFee, setNewEntryFee] = useState(null);
  const [isManager, setIsManager] = useState(false);
  const [players, setPlayers] = useState([]);
  const contractABI = abi;
  const contractAddress = '0xa1A36799effd6bdb848D78E3c98Fc628af06f9e4';

  useEffect(() => {
    if (contract && account) {
      checkIfManager();
      getEntryFee();
    }
  }, [contract, account]);

  const checkIfManager = async () => {
    try {
      const manager = await contract.methods.manager().call();
      setIsManager(manager.toLowerCase() === account.toLowerCase());
    } catch (error) {
      console.error('Error checking manager:', error);
    }
  };

  const enter = async () => {
    if (contract && newEntryFee) {
      try {
        const web3 = new Web3(window.ethereum);
        const feeInWei = web3.utils.toWei(newEntryFee, 'ether');
        await contract.methods.enter().send({ from: account, value: feeInWei });
        console.log('Entered the lottery successfully');
      } catch (error) {
        if (error.code === 4001) {
          console.error('Transaction denied by user');
          alert('Transaction was denied. Please try again.');
        } else {
          console.error('Error entering the lottery:', error);
        }
      }
    }
  };

  const getManager = async () => {
    if (contract) {
      try {
        const manager = await contract.methods.manager().call();
        console.log('manager:', manager);
      } catch (error) {
        console.error('Error getting manager:', error);
      }
    }
  };

  const getEntryFee = async () => {
    if (contract) {
      try {
        const fee = await contract.methods.entryFee().call();
        setNewEntryFee(Web3.utils.fromWei(fee, 'ether'));
        console.log('entry fee:', fee);
      } catch (error) {
        console.error('Error getting entry fee:', error);
      }
    }
  };

  const setEntryFee = async () => {
    if (contract && newEntryFee) {
      try {
        const web3 = new Web3(window.ethereum);
        const feeInWei = web3.utils.toWei(newEntryFee, 'ether');
        await contract.methods.setEntryFee(feeInWei).send({ from: account });
        console.log('Entry fee set successfully');
      } catch (error) {
        console.error('Error setting entry fee:', error);
      }
    }
  };

  const getPlayers = async () => {
    if (contract) {
      try {
        const players = await contract.methods.getPlayers().call();
        setPlayers(players);
        console.log('players:', players);
      } catch (error) {
        console.error('Error getting players:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        const web3 = new Web3(window.ethereum);
        const contractInstance = new web3.eth.Contract(contractABI, contractAddress);
        setContract(contractInstance);
      } catch (error) {
        console.error('User denied account access or error occurred:', error);
      }
    } else {
      alert('MetaMask not detected. Please install MetaMask.');
    }
  };

  return (
    <div>
      <button onClick={connectWallet}>
        {account ? `Connected: ${account}` : 'Connect MetaMask'}
      </button>
      <button onClick={getManager}>Get Manager</button>
      <button onClick={getEntryFee}>Get Entry Fee</button>
      <button onClick={getPlayers}>Get Players</button>
      <div>
        {isManager && (
          <div>
            <input
              type="number"
              value={newEntryFee}
              onChange={(e) => setNewEntryFee(e.target.value)}
              placeholder="New Entry Fee"
            />
            <button onClick={setEntryFee}>
              Set Entry Fee
            </button>
          </div>
        )}
      </div>
      <button onClick={enter}>Enter Lottery</button>
      <div>
        <h3>Players</h3>
        <ol>
          {players.map((player, index) => (
            <li key={index}>{player}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default App;