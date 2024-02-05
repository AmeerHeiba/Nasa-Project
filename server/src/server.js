
require('dotenv').config();

// Using node built in http module.
const http = require('http');

const app = require('./app');

const {mongoConnect} = require('./services/mongo');

const {loadLaunchData} = require('./model/launches.model');


// Setting Port to 8000 and enabling system admin to edit using environment variables.
const PORT = process.env.PORT || 8000;


const server = http.createServer(app);

const {loadPlanetsData} = require('./model/planets.model');

async function startServer() {

    //connecting to mongo database.

    await mongoConnect();

    await loadPlanetsData();

    await loadLaunchData();

    server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    });


}

startServer(); 






