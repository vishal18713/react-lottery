import { ethers } from 'ethers';


const contractAddress = '0xa1A36799effd6bdb848D78E3c98Fc628af06f9e4';
const contractABI = 
    [
        {
            "inputs": [],
            "name": "enter",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_initialEntryFee",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "newEntryFee",
                    "type": "uint256"
                }
            ],
            "name": "EntryFeeChanged",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "pickWinner",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_newEntryFee",
                    "type": "uint256"
                }
            ],
            "name": "setEntryFee",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "winner",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "winnerAmount",
                    "type": "uint256"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "manager",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "managerAmount",
                    "type": "uint256"
                }
            ],
            "name": "WinnerPaid",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "entryFee",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getPlayers",
            "outputs": [
                {
                    "internalType": "address[]",
                    "name": "",
                    "type": "address[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getPreviousWinners",
            "outputs": [
                {
                    "internalType": "address[]",
                    "name": "",
                    "type": "address[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "manager",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "players",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "previousWinners",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
;

let provider;
let contract;

export const init = async () => {

    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, contractABI, signer);
    } else {
        console.error('No Ethereum provider detected');
    }
};

export const getEntryFee = async () => {
    const fee = await contract.entryFee();
    return ethers.utils.formatEther(fee);
};

export const enterLottery = async () => {
    const fee = await contract.entryFee();
    const tx = await contract.enter({ value: ethers.utils.parseEther(fee) });
    await tx.wait();
};

export const pickWinner = async () => {
    const tx = await contract.pickWinner();
    await tx.wait();
};

export const getPlayers = async () => {
    const players = await contract.getPlayers();
    return players;
};

export const getPreviousWinners = async () => {
    const winners = await contract.getPreviousWinners();
    return winners;
};

export const setEntryFee = async (newFee) => {
    const tx = await contract.setEntryFee(ethers.utils.parseEther(newFee));
    await tx.wait();
};
