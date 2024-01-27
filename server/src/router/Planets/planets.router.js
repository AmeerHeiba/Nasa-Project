const express = require('express');
const planetRouter = express.Router();

const {
    getAllPlanets,
}= require('./planets.controller');

planetRouter.get('/planets', getAllPlanets);

module.exports = planetRouter;