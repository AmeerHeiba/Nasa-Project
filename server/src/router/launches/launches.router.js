const express = require('express');
const launchesRouter = express.Router();
const {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpDeleteLaunch
} = require('./launches.controller');
launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', httpAddNewLaunch);
launchesRouter.delete('/:flightNumber', httpDeleteLaunch);
module.exports = launchesRouter;