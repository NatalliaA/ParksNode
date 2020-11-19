const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

//virtual proprety for thumbnail
const ImageSchema = new Schema(
    {
        url: String,
        filename: String
    }
);
//changing image url by adding width w_200 for a smaller size for edit.ejs (cloudinary feature)
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200');
});

const ParkSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

//Mongoose midlleware to trigger findByIdAndDelete in DELETE PARK ROUTE
//for deleting associated reviews from DB after deleting a park
ParkSchema.post('findOneAndDelete', async function(doc){
   if(doc){
        await Review.deleteMany({
            _id: {$in: doc.reviews}
             });
        }
    });

module.exports = mongoose.model('Park', ParkSchema);