const Web3 = require('web3').default || require('web3');
const web3 = new Web3('http://127.0.0.1:7545'); // Ganache local blockchain
module.exports = web3;
