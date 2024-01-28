const express = require('express');
const app = express();
const planetRouter = require('./router/Planets/planets.router');
launchesRouter = require('./router/launches/launches.router');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

app.use(cors({
    origin: 'http://localhost:3000',
}));

app.use(morgan('combined'));

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/planets' , planetRouter);
app.use('/launches', launchesRouter);


app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});



module.exports = app;

