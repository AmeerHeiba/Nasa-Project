const {getAllLaunches, addNewLaunch, deleteLaunch, existsLaunch} = require('../../model/launches.model');
function httpGetAllLaunches(req, res) {
    return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {

    const launch = req.body;

    if(!launch.mission ||!launch.rocket ||!launch.target ||!launch.launchDate){
        return res.status(400).json({
            message: 'Missing required fields'
        });
    }
    launch.launchDate = new Date(launch.launchDate);
    launch.launchDate.toString() === 'Invalid Date'? res.status(400).json({message: 'Invalid Date'}) : null;

    addNewLaunch(launch);
    res.status(201).json(launch);
}


function httpDeleteLaunch(req, res) {
    const flightNumber = req.params.flightNumber;
    if(!existsLaunch(flightNumber)){
        return res.status(404).json({
            message: 'Launch not found'
        });
    }

    const aborted =deleteLaunch(Number(flightNumber));
    res.status(200).json(aborted);
}
module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpDeleteLaunch
};