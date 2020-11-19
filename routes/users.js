const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const users = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

//chaining routes with the same path('/register')
router.route('/register')
.get(users.renderRegisterForm)
.post(catchAsync(users.registerUser));

//chaining routes with the same path('/login')
router.route('/login')
.get( users.renderLoginForm)
.post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),
users.loginUser);

//LOGOUT ROUTE
router.get('/logout', users.logoutUser);

//SHOW REGISTER FORM
//router.get('/register', users.renderRegisterForm)

//SUBMIT REGISTER FORM
//router.post('/register', catchAsync(users.registerUser));

//SHOW LOGIN FORM
//router.get('/login', users.renderLoginForm);

//SUBMIT LOGIN FORM
//passport.authenticate('local', ..) middleware from Passport 
//hashes password and compares to hashed password in the DB
//local is strategy, (it can be 'facebook', 'twitter', etc.)
/* router.post('/login', 
passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),
users.loginUser); */



module.exports = router;