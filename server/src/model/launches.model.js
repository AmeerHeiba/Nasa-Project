const launches = new Map();
let latestFlightNumber = 100;

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 15, 2030 12:00:00'),
    target: 'Kepler-442 b',
    customer: ['ZTM, NASA'],
    upcoming: true,
    success: true,
};



launches.set(launch.flightNumber, launch);

function existsLaunch(flightNumber) {
 
    return launches.has(Number(flightNumber));

}

function getAllLaunches(){
    return Array.from(launches.values());
}

function addNewLaunch(launch){
    latestFlightNumber++;
    launches.set(latestFlightNumber, Object.assign(launch,{
        flightNumber: latestFlightNumber,
        customers: ['ZTM, NASA'],
        upcoming: true,
        success: true,
    } ));

}

function deleteLaunch(flightNumber){
    const aborted = launches.get(Number(flightNumber));
    aborted.upcoming = false;
    aborted.success = false;
    launches.set(Number(flightNumber), aborted);

    return aborted;
}

module.exports= {
    getAllLaunches,
    addNewLaunch,
    deleteLaunch,
    existsLaunch
};