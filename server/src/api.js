const express= require('express');


const planetRouter = require('./router/Planets/planets.router');
const launchesRouter = require('./router/launches/launches.router');

const api = express();

api.use('/planets' , planetRouter);
api.use('/launches', launchesRouter);

module.exports = api;