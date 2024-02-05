const {getAllLaunches, scheduleNewLaunch, abortLaunch, existsLaunchWithId} = require('../../model/launches.model');

const {getPagination} = require('../../services/query');
async function httpGetAllLaunches(req, res) {
    const {skip, limit} = getPagination(req.query);
    const launches = await getAllLaunches(skip, limit);
    return res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res) {

    const launch = req.body;

    if(!launch.mission ||!launch.rocket ||!launch.target ||!launch.launchDate){
        return res.status(400).json({
            message: 'Missing required fields'
        });
    }
    launch.launchDate = new Date(launch.launchDate);
    launch.launchDate.toString() === 'Invalid Date'? res.status(400).json({message: 'Invalid Date'}) : null;

    await scheduleNewLaunch(launch);
    res.status(201).json(launch);
}


async function httpDeleteLaunch(req, res) {
    const flightNumber = req.params.flightNumber;
    const existsLaunch = await existsLaunchWithId(Number(flightNumber));
    if(!existsLaunch){
        return res.status(404).json({
            message: 'Launch not found'
        });
    }

    const aborted = await abortLaunch(Number(flightNumber));

    if(!aborted){
        return res.status(400).json({
            message: 'Data was not updated'
        });
    }
    res.status(200).json({ok: true});
}
module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpDeleteLaunch
};