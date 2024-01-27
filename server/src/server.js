/**
 * pass in, express this app object specifically into create server.
And any middleware and route handlers that I attach to this app object will respond to requests coming
in to our server.
Express has really just a fancy listener, a function for our built in node HTP server and the listen
function that we get from Express that we can call on app is exactly the same as the listen function
on our server object.
We can use either of them to start our express server.
The added benefit of this is that now we can organize our code a little bit more by separating the server
functionality that we have here from our express code, which we're going to put into a new file called
App.js
And this is going to have all of our express code.
So let's move that out of server dogs into app dogs and set the module dot exports to be this app object
from Express, which we can now import in server dogs.
So it's going to be contest, and the app is now coming in from this relative imports require dot slash
app.
And that's the app that we pass in to our FTP server.
We'll see later in the course when we talk about things like web sockets that's starting our server
in this way.
Using the built in HTP server allows us to not only respond to FTP requests, but also to other types
of connections, for example, to use web sockets for real time communication as opposed to sending
requests and waiting for the response.
 */

// Using node built in http module.
const http = require('http');

const app = require('./app');

// Setting Port to 8000 and enabling system admin to edit using environment variables.
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

const {loadPlanetsData} = require('./model/planets.model');

async function startServer() {

    await loadPlanetsData();
    server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    });


}

startServer(); 






