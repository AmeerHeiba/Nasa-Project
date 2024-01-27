const express = require('express');
const app = express();
const planetRouter = require('./router/Planets/planets.router');
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(express.json());
app.use(planetRouter);



module.exports = app;

