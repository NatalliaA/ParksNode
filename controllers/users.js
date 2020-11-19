const User = require('../models/user');

module.exports.renderRegisterForm = (req, res)=>{
    res.render('users/register');
};

module.exports.registerUser = async(req, res, next) => {
    try{
    const { email, username, password } = req.body;
    const user = new User({email, username});
    //it will hash the password
    const registeredUser = await User.register(user, password);
    //to be loged in after registering
    req.login(registeredUser, err => {
        if(err) return next(err);
        req.flash('success', 'Welcome to WeSeeNature!');
        res.redirect('/parks');
    });
    } 
    catch(e){
        req.flash('error', e.message);
        res.redirect('register');
    }   
};

module.exports.renderLoginForm = (req, res) =>{
    res.render('users/login');
};

module.exports.loginUser = (req, res) =>{
    req.flash('success', 'Welcome back!');
    //where user wanted to go/requested url
    const redirectUrl = req.session.returnTo || '/parks';
    //then delete url from the session
    delete req.session.returnTo;     
    res.redirect(redirectUrl);   
};

module.exports.logoutUser = (req, res) =>{
    req.logout();
    req.flash('success', 'See you next time!');
    res.redirect('/parks');
};