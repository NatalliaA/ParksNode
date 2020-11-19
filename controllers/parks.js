const Park = require('../models/park');
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res)=>{
    const parks = await Park.find({});
    res.render('parks/index', {parks});
};

module.exports.renderNewForm = (req, res)=>{   
     res.render('parks/new');
};

module.exports.createPark = async (req, res, next)=>{       
        //make sure you add urlencoded to parse req.body           
        const newPark = new Park(req.body.park);
        //put into array of images: path and filename values from multer req.files after uploading to cloudinary
        newPark.images = req.files.map(f => ({url: f.path, filename: f.filename}));
        //get user id from logged in user
        newPark.author = req.user._id;    
        await newPark.save();
        req.flash('success', 'Successfully added a new post.');
        res.redirect(`/parks/${newPark._id}`);   
};

module.exports.showPark = async (req, res)=>{
    const { id } = req.params;
    //populate review details and and park author 
    //const foundPark = await Park.findById(id).populate('reviews').populate('author');

    //populate park author and review details with its author
    const foundPark = await Park.findById(id).populate({
    path: 'reviews',
    populate: {
        path: 'author'
    }
    }).populate('author');
    //if someone saved/bookmarked url with the park id but the park was deleted after
    if(!foundPark){
        req.flash('error', 'Sorry. The park was not found.');
        return res.redirect('/parks');
    }
    res.render('parks/show', {foundPark});
};

module.exports.renderEditForm = async (req, res)=>{
    const { id } = req.params;
    const park = await Park.findById(id);   
    if(!park){
           //if someone saved/bookmarked url with the park id but the park was deleted after
        req.flash('error', 'Sorry. The park was not found.');
        return res.redirect('/parks');
    }   
    res.render('parks/edit', {park});
};
module.exports.updatePark = async (req, res)=>{
    const { id } = req.params;  
    const park = await Park.findByIdAndUpdate(id, {...req.body.park}, {runValidators: true});

    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    //... push not the array but the data from the array
    park.images.push(...imgs);
    await park.save();

    //pull out deleted images(if user checks) from the images array using their filename and update park
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            //delete image from Cloudinary
            cloudinary.uploader.destroy(filename);
        }
        await park.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
   
    req.flash('success', 'Your post has been updated.');
    res.redirect(`/parks/${park._id}`);
};

module.exports.deletePark = async (req, res)=>{
    const { id } = req.params;
    const park = await Park.findByIdAndDelete(id);
    for(let img of park.images){
        //delete image from Cloudinary
        cloudinary.uploader.destroy(img.filename);
    }

    req.flash('success', 'Your post has been deleted');
    res.redirect('/parks');
};