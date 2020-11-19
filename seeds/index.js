//to run this file on its own, seperately from the Node app
//for development purpose
//empty parksdb and put into it parks created only in this file


const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Park = require('../models/park');

mongoose.connect('mongodb://localhost:27017/parksdb', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

//to pick a random element from an array:
//array[Math.floor(Math.random() * array.length)]
//call this function expression later as sample(array)
const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    //first empty DB
    await Park.deleteMany({});
    //then create parks

    //create 1 park and add it to db
    /* const park = new Park({title: 'New NP', location: 'Arizona'});
    await park.save(); */

   //create 10 parks and add them to db
    for (let i = 0; i < 10; i++) {
        //create a random integer 0-999 because there are 1000 objects in cities array    
        const random1000 = Math.floor(Math.random() * 1000);
        //random price from $10-30
        const price = Math.floor(Math.random()*20 + 10);
        //get a random location(Los Angeles, California) from 1000 cities in cities.js
        //create a random title from array(descriptors,places) in seedHelpers.js by calling sample(array)       
        const park = new Park({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/addedpictures/image/upload/v1605623056/ParksNode/h4xk7kvglyp7nljyme5y.jpg',
                    filename: 'ParksNode/h4xk7kvglyp7nljyme5y'
                }
            ],
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            price: price,
            author: '5fb1f0bd8b39c3331ce37db7'
        });
     await park.save();
    }    
}

//call sedDB()
seedDB().then(() => {
    //close connection after seeding db is done
    mongoose.connection.close();
});