const { parkSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Park = require('./models/park');
const Review = require('./models/review');

//middleware for park validation form inputs before adding them to DB in CREATE/UPDATE
module.exports.validatePark = (req, res, next) =>{ 
    const { error } = parkSchema.validate(req.body);   
    if(error){
        //create a string of the array with error details
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
};
//middleware for review validation form inputs before adding them to DB in CREATE/UPDATE
module.exports.validateReview = (req, res, next) =>{ 
    const { error } = reviewSchema.validate(req.body);   
    if(error){
        //create a string of the array with error details
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
};

//isAuthenticated() - helper method from Passport
module.exports.isLoggedIn = (req, res, next)=> {
    //store the url what user is requesting
    //to get user back to that url after login
    req.session.returnTo = req.originalUrl;
    if(!req.isAuthenticated()){
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
};

module.exports.isAuthor = async(req, res, next) =>{
    const { id } = req.params;
    const park = await Park.findById(id);
    //if the user does not own the post
    if (!park.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that.');
        return res.redirect(`/parks/${park._id}`);
    }
    next();
};

module.exports.isReviewAuthor = async(req, res, next) =>{
    //from the delete review route
    const { id, review_id } = req.params;
    const review = await Review.findById(review_id);
    //if the user does not own the post
    if (!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that.');
        return res.redirect(`/parks/${id}`);
    }
    next();
};