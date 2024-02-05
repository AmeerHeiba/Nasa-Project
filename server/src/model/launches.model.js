const { default: axios } = require('axios');
const Mongolaunches = require('./launches.mongo');
const planets = require('./planets.mongo');

// old code using Map
// const launches = new Map();
// let latestFlightNumber = 100;

// const launch = {
//     flightNumber: 100, // flight_number from spacex api response.
//     mission: 'Kepler Exploration X', // name from spacex api response.
//     rocket: 'Explorer IS1', // rocket.name from spacex api response.
//     launchDate: new Date('December 15, 2030 12:00:00'), // date_local from spacex api response.
//     target: 'Kepler-442 b', // new feature not exisisting in spacex api response.
//     customer: ['ZTM, NASA'],
//     upcoming: true, // upcoming flag from spacex api response.
//     success: true, // success flag from spacex api response.
// };

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches(){

        // SPACEX API uses "POST" to pass query parameters, hence we used the below query to get rocket name from launch data instead of getting rocket id only
    // this is called "populating" when we have row data comning from mongo with data from different collections such as launch response containst "rocket" assigned to each launch but instead of showing all rocket data it's just showing the id 
    // when we have the launch data we will need to show the rocket name from the launch response hence we are populating this using the below query to get the rocket name from launch data instead of getting the rocket id only
    // same thing is being done with the customers list which exists in payloads collection in mongo.
    
    //Take in considration that SPACEX is a paginated API hence to get all the data requested at once without 
    //pagination we used an option called "pagination" and set it to false.
    const response = await axios.post(SPACEX_API_URL,{
        query:{},
        options:{
            pagination:false,
           populate:[
                {
                    path:'rocket',
                    select:{
                        name:1
                    }
                },
                {
                    path:'payloads',
                    select:{
                        customers:1
                    }
                }
            ]
        }
        

    });

    if (response.status !== 200){
        console.log('Error loading launches data');
        throw new Error('Error loading launches data');
    }

    const launchDocs = response.data.docs;
    for(const launchDoc of launchDocs){
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload)=> {
            return payload['customers'];
        });

        const launch = {
            flightNumber: launchDoc['flight_number'], // flight_number from spacex api response.
            mission: launchDoc['name'], // name from spacex api response.
            rocket: launchDoc['rocket']['name'], // rocket.name from spacex api response.
            launchDate: launchDoc['date_local'], // date_local from spacex api response.
            customer: customers,
            upcoming: launchDoc['upcoming'], // upcoming flag from spacex api response.
            success: launchDoc['success'], // success flag from spacex api response.
        };
        // await saveLaunch(launch);
        // populate launches collection 
        await saveLaunch(launch);
    }


}

async function loadLaunchData(){

    console.log('Loading launch data...');


    // Since loading big chunk of launches data is resource intensive,
    // we will check if the data still the same as the last time we loaded it by comparing the Falcon 1 flight
    // if it exists we will load the data from the API.

   const firstLaunch = await findLaunch({
        flightNumber:1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    });

    if (firstLaunch){
        console.log('Launch data already loaded.');
        
    }else{
        populateLaunches();
    }




}

async function findLaunch(filter){
    return await Mongolaunches.findOne(filter);
}

// old code using Map
// launches.set(launch.flightNumber, launch);

// saveLaunch(launch);

// old code using static data
// function existsLaunch(flightNumber) {
 
//     return launches.has(Number(flightNumber));

// }

async function getLatestFlightNumber(){
    // below line searches the latest flight number in the database "-flightNumber" means to sort the findings in descending order
    const latestFlightNumber =  await Mongolaunches.findOne().sort('-flightNumber');
    if(!latestFlightNumber){
        return 100;
    }
    return latestFlightNumber.flightNumber;
}

async function scheduleNewLaunch(launch){

    // checking if the target planet exists in the database
    // findOne() function returns only one document if it exists however find() returns multiple documents if it does not
    const planet = await planets.findOne({
        keplerName: launch.target,
    });
    if(!planet){
        throw new Error('Target planet not found'); 
    }
    const highestFlightNumber = await getLatestFlightNumber();
    const newLaunch = Object.assign(launch,{
        flightNumber: highestFlightNumber + 1,
        customers: ['ZTM, NASA'],
        upcoming: true,
        success: true,
    });

    await saveLaunch(newLaunch);

}

async function getAllLaunches(skip, limit){
    // old code using Map
    // return Array.from(launches.values());
    return await Mongolaunches.find({},{
        __v:0,
        _id:0
    })
    .sort({flightNumber: 1}) /// built in mongo function that sorts the results in ascending order
    .skip(skip) /// built in mongo function that skips the first 50 launches
    .limit(limit) /// built in mongo function that limits the results to 50 launches

}
// Old code using static data
// function addNewLaunch(launch){
//     latestFlightNumber++;
//     launches.set(latestFlightNumber, Object.assign(launch,{
//         flightNumber: latestFlightNumber,
//         customers: ['ZTM, NASA'],
//         upcoming: true,
//         success: true,
//     } ));

// }

// old code using static data

// function deleteLaunch(flightNumber){
//     const aborted = launches.get(Number(flightNumber));
//     aborted.upcoming = false;
//     aborted.success = false;
//     launches.set(Number(flightNumber), aborted);

//     return aborted;
// }



async function abortLaunch(launchId){
    const aborted = await Mongolaunches.updateOne({
        flightNumber: launchId,
    },{
        upcoming: false,
        success: false,
    });

    return aborted.acknowledged === true && aborted.modifiedCount === 1;
}


async function saveLaunch(launch){

    // check if flight number already exists in the database then update it otherwise insert it
    await Mongolaunches.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    },launch, {upsert:true});
}

async function existsLaunchWithId(launchId){
    const launch = await findLaunch({
        flightNumber: launchId,
    });
    return launch;
}

module.exports= {
    loadLaunchData,
    getAllLaunches,
    abortLaunch,
    existsLaunchWithId,
    scheduleNewLaunch
};