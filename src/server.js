const express = require('express');
const cors = require('cors');
const app = express();
const port = 3030;

app.use(cors());

const budget = require('./budget.json');

app.get('/budget', (req,res) => {
    res.json(budget);
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});