const Joi = require('joi');

//joi Schema (using joi npm) for form input validation from server-side
//checks if there is req.body.park and validates all the park properties
module.exports.parkSchema = Joi.object({
    park: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        //image: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required()   
    }).required(),
    deleteImages: Joi.array()
    });

    module.exports.reviewSchema = Joi.object({
        review: Joi.object({
            body: Joi.string().required(),
            rating: Joi.number().required().min(1).max(5)        
        }).required()
        });   
        

 