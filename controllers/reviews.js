const Review = require('../models/review');
const Park = require('../models/park');

module.exports.createReview = async (req, res, next) =>{
    //get park id
    const { id } = req.params;
    const park = await Park.findById(id);
    //create a review object by taking form inputs
    const review = new Review(req.body.review);
    review.author = req.user._id;
    //add review to park reviews array
    park.reviews.push(review);
    await review.save();
    await park.save();   
    req.flash('success', 'Your review has been added.');
    res.redirect(`/parks/${park._id}`);    
};

module.exports.deleteReview = async(req, res, next)=> {
    const { id, review_id } = req.params;  
    //$pull: delete review from reviews array in the park
    await Park.findByIdAndUpdate(id, {$pull: {reviews: review_id}});
    //delete the entire review
    await Review.findByIdAndDelete(review_id);
    req.flash('success', 'Your review has been deleted.');
    res.redirect(`/parks/${id}`);
};