const express = require('express');
const app = express();
const voteRoutes = require('./routes/voteRoutes');
require('dotenv').config();

app.use(express.json());
app.use('/api', voteRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
