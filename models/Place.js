const { ref } = require('joi')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Review = require('./review')
const { type } = require('express/lib/response')

const PlaceSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    images: [{
        url: String,
        filename: String,
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    review: [{
        type: Schema.Types.ObjectId,
        ref: 'Review',
    }]
})

PlaceSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.review } })
    }
});
module.exports = mongoose.model('Place', PlaceSchema)