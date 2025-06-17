const mongoose = require('mongoose');
const Review = require('./review');
const { string } = require('joi');



// https://res.cloudinary.com/dru46ezau/image/upload/v1749984475/YelpCamp/ufrumnrayrburuwparnc.jpg

const ImageSchema = new mongoose.Schema({
    url: String,
    filename: String,
});

ImageSchema.virtual('thumbnail').get(function(){
    if(!this.url) return '';
    const parts = this.url.split('/upload/');
    return `${parts[0]}/upload/w_200/${parts[1]}`;
});

ImageSchema.set('toJSON', { virtuals: true });
ImageSchema.set('toObject', { virtuals: true });

const CampgroundSchema = new mongoose.Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
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
    ],
},{
    toObject: { virtuals: true }, 
    toJSON: { virtuals: true }
});
// mongoose.set('strictQuery', true);

CampgroundSchema.virtual('popUpMarkup').get(function(){
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong><p>${this.description.substring(0, 20)}...</p>`
});


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