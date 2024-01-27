//Using 3rd party pckg csv-parse to handle csv files
const { parse } = require('csv-parse');
//using FileSystem pckg to open the csv file
const fs = require('fs');
// using array to store the response from File System after opening the csv file
const habitablePlanet = [];

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
 .on('data',(data)=>{
    if(isHabitablePlanet(data)){
        habitablePlanet.push(data);
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



module.exports = {
    loadPlanetsData,
    planets:habitablePlanet,
};

