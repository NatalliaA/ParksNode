const express = require('express');
const router = express.Router({mergeParams: true});
//access to revies.createReview, reviews.deleteReview etc.
const reviews = require('../controllers/reviews');
const Review = require('../models/review');
const Park = require('../models/park');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

//REVIEW ROUTES
//CREATE REVIEW
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

//DELETE REVIEW
router.delete('/:review_id', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;