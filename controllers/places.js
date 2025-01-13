const Place = require("../models/Place.js");

module.exports.index = async (req, res) => {
    const places = await Place.find();
    res.render('places/index', { places });
}

module.exports.create = async (req, res) => {
    res.render('places/create');
}

module.exports.store = async (req, res, next) => {
    const place = new Place(req.body.place);
    place.author = req.user._id;
    await place.save();
    req.flash('success_msg', 'Place added successfully');
    res.redirect('/places');
}

module.exports.show = async (req, res) => {
    const place = await Place.findById(req.params.id)
    .populate({
        path: 'review',
        populate: {
            path: 'author',
        },
    })
    .populate('author');
    res.render('places/show', { place });
}

module.exports.edit = async (req, res) => {
    const place = await Place.findById(req.params.id);
    res.render('places/edit', { place });
}

module.exports.update = async (req, res) => {
    await Place.findByIdAndUpdate(req.params.id, { ...req.body.place });
    req.flash('success_msg', 'Place updated successfully');
    res.redirect(`/places/${req.params.id}`);
}

module.exports.delete = async (req, res) => {
    await Place.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Place deleted successfully');
    res.redirect('/places');
}

