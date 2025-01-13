const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const PlaceController = require('../controllers/places.js');
const isValidObjectId = require('../middlewares/isValidObjectId');
const isAuth = require('../middlewares/isAuth.js');
const { isAuthorPlace } = require('../middlewares/isAuthor');
const { validatePlace } = require('../middlewares/validator');
const upload = require('../config/multer.js');

const router = express.Router();

router.route('/')
    .get(wrapAsync(PlaceController.index))
    // .post(isAuth, validatePlace, wrapAsync(PlaceController.store))
    .post(isAuth, upload.array('image', 5), (req, res) => {
        console.log(req.files);
        console.log(req.body);
        res.send('it works');
    })

router.get('/create', isAuth, wrapAsync(PlaceController.create));

router.route('/:id')
    .get(isValidObjectId('/places'), wrapAsync(PlaceController.show))
    .put(isAuth, isAuthorPlace, isValidObjectId('/places'),validatePlace, wrapAsync(PlaceController.update))
    .delete(isAuth, isAuthorPlace, isValidObjectId('/places'),wrapAsync(PlaceController.delete))

router.get('/:id/edit', isAuth, isAuthorPlace, isValidObjectId('/places'),wrapAsync(PlaceController.edit));

module.exports= router;
