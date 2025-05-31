// const pool = require('../models/db');
// const web3 = require('../blockchain/web3Provider');

// exports.castVote = async (req, res) => {
//   const { voterId, candidateId } = req.body;

//   try {
//     // Save metadata in PostgreSQL
//     await pool.query('UPDATE users SET is_voted = true WHERE id = $1', [voterId]);

//     // TODO: Interact with smart contract using web3
//     // e.g., contract.methods.vote(candidateId).send({ from: account });

//     res.status(200).send('Vote recorded on blockchain!');
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error casting vote');
//   }
// };

const pool = require('../models/db');
// const web3 = require('../blockchain/web3Provider');  // Commented out for now

exports.castVote = async (req, res) => {
  const { voterId, candidateId } = req.body;

  try {
    await pool.query('UPDATE users SET is_voted = true WHERE id = $1', [voterId]);

    // Skipping blockchain interaction for now

    res.status(200).send('Vote recorded successfully (no blockchain)');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error casting vote');
  }
};


exports.checkStatus = async (req, res) => {
  const { id } = req.params;
  // For now, just return a dummy status
  res.status(200).json({ voterId: id, status: 'dummy-status', is_voted: false });
};