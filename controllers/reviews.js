const Place = require('../models/Place');
const Review = require('../models/review');

module.exports.store = async (req, res) => {
    const { place_id } = req.params;

    const review = new Review(req.body.review);
    review.author = req.user._id;

    const place = await Place.findById(place_id);
    place.review.push(review);
    
    await review.save();
    await place.save();
    req.flash('success_msg', 'Review added successfully');
    res.redirect(`/places/${place_id}`);
}

module.exports.destroy = async (req, res) => {
    const { place_id, review_id } = req.params;
    await Place.findByIdAndUpdate(place_id, { $pull: { review: review_id } });
    await Review.findByIdAndDelete(review_id);
    req.flash('success_msg', 'Review deleted successfully');
    res.redirect(`/places/${place_id}`);
}