const mongoose = require('mongoose');



const MONGO_URL = process.env.MONGO_URL

//using Mongoose to connect to the database.

//logging a success message if mongo database connection is successful.

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Error connecting to MongoDB', err);
});

async function mongoConnect() {
    await mongoose.connect(MONGO_URL);
}

module.exports = {mongoConnect};