const mongoose = require('mongoose');
const cities = require('./cities')
const Campground = require('../models/campground');
const {places, descriptors} = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/CampPoint');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', ()=> {
    console.log('database connected');
});

const add = array=> array[Math.floor(Math.random() * array.length)];

const seedDB = async ()=> {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++){
        const rand = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30) + 10;
        const campground = new Campground({
            author: '684c1b9d7cea1bfb5f123d8c',
            location: `${cities[rand].city}, ${cities[rand].state}`,
            title: `${add(descriptors)} ${add(places)}`,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium laborum deleniti nemo voluptatem, eveniet tempora dicta error ex, quidem quo natus debitis aperiam. Minus, rem corrupti? Aperiam dolores at neque",
            price: price,
            images: [
                {
                    url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png',
                    filename: 'YelpCamp/ahfnenvca4tha00h2ubt',
                },
                {
                    url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ruyoaxgf72nzpi4y6cdi.png',
                    filename: 'YelpCamp/ruyoaxgf72nzpi4y6cdi',
                }
            ],
        });
        await campground.save();
    }
};

seedDB().then(()=> {
    mongoose.connection.close();
});