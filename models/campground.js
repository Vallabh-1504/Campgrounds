const mongoose = require('mongoose');
const Review = require('./review');
const { string } = require('joi');


// https://res.cloudinary.com/dru46ezau/image/upload/v1749984475/YelpCamp/ufrumnrayrburuwparnc.jpg

const ImageSchema = new mongoose.Schema({
    url: String,
    filename: String
})
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', 'upload/w_200');
});
ImageSchema.set('toJSON', { virtuals: true });


const CampgroundSchema = new mongoose.Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, {toJSON: {virtuals: true}});

// mongoose.set('strictQuery', true);

CampgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
module.exports = mongoose.model('Campground', CampgroundSchema);