const express = require('express');
const router = express.Router();
//access to parks.index, parks.renderNewForm etc.
const parks = require('../controllers/parks');
const catchAsync = require('../utils/catchAsync');
const Park = require('../models/park');
const { isLoggedIn, isAuthor, validatePark } = require('../middleware');
//image upload
const multer = require('multer');
//storage from index.js in cloudinary- node takes index.js files automatically
const {storage} = require('../cloudinary');
//store images in cloudinary storage
const upload = multer({ storage });

//local storage in folder 'uploads'
//const upload = multer({ dest: 'uploads/' });

//chaining routes with the same path('/')
router.route('/')
.get(catchAsync(parks.index))
.post(isLoggedIn, upload.array('image'), validatePark, catchAsync(parks.createPark));

//NEW ROUTE - show form for adding a new park
//ORDER! Schould come before '/:id
router.get('/new', isLoggedIn, parks.renderNewForm);

//chaining routes with the same path('/:id')
router.route('/:id')
.get(catchAsync(parks.showPark))
.put(isLoggedIn, isAuthor, upload.array('image'), validatePark, catchAsync(parks.updatePark))
.delete(isLoggedIn, isAuthor, catchAsync(parks.deletePark));

//EDIT ROUTE - show edit form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(parks.renderEditForm));

//INDEX ROUTE - show a list of parks
//router.get('/', catchAsync(parks.index));

//CREATE ROUTE - submit form with a new park
//router.post('/', isLoggedIn, validatePark, catchAsync(parks.createPark));

//SHOW ROUTE - show park's detailed page
//router.get('/:id', catchAsync(parks.showPark));

//UPDATE ROUTE - submit edit form
//router.put('/:id', isLoggedIn, isAuthor, validatePark, catchAsync(parks.updatePark));

//DELETE ROUTE - delete park
//router.delete('/:id', isLoggedIn, isAuthor, catchAsync(parks.deletePark));

module.exports = router;