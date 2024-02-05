//Using 3rd party pckg csv-parse to handle csv files
const { parse } = require('csv-parse');
//using FileSystem pckg to open the csv file
const fs = require('fs');

const planets = require('./planets.mongo');

// using array to store the response from File System after opening the csv file
// const habitablePlanet = [];

const path = require('path');


// Applying NASA considitoins to filter only habitable planets
function isHabitablePlanet(planet){
    return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet ['koi_insol'] < 1.11 
    && planet ['koi_prad']< 1.6;
}


function loadPlanetsData(){
// Openning he csv file and then pushing the data to results array for later handling 
return new Promise ((resolve, reject) => { 
    fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
// Parsing Part using the 3rd party library to become objects
 .pipe(parse({
    comment: '#',
    columns: true
 }))
 .on('data',async (data)=>{
    if(isHabitablePlanet(data)){
        // habitablePlanet.push(data);
        savePlanet(data);
    }
    
 })
 .on('error',(err)=>{
    console.log(err);
    reject(err);
 })
 .on('end',()=>{
    resolve();

 });
});

}


async function getAllPlanets(){
    // return habitablePlanet from planets mongo db using the find() function passing empty object as parameter since we need all available data.
    //find({},{__v:0,_id:0}) means to exclude _id and __v fields from returned data
    return await planets.find({},{
        __v:0,
        _id:0
    });
}

async function savePlanet(data){
    
        // saving the data to the database using the planets mongo model 
        /*
        below UpdateOne function is used to update the data in the database (only insert if dosen't
        already exist) update.One({the data to be searching for}, {if not exist then insert},{upsert})
        */
       try{
        await planets.updateOne({
            keplerName: data.kepler_name
        },{
            keplerName: data.kepler_name
        },{upsert:true});
    } catch(err){
        console.log(`Could not save the planet ${err}`);
    }
}


module.exports = {
    loadPlanetsData,
    getAllPlanets,
};

