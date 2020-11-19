if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
//process.env.CLOUDINARY_CLOUD_NAME
//process.env.CLOUDINARY_API_KEY
//process.env.CLOUDINARY_SECRET

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');

const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const { parkSchema, reviewSchema } = require('./schemas');

const Park = require('./models/park');
const Review = require('./models/review');
const User = require('./models/user');
const parkRoutes = require('./routes/parks');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

//create and connect to DB
mongoose.connect('mongodb://localhost:27017/parksdb', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=> {
    console.log('Database connected.');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//parse req.body - form inputs
app.use(express.urlencoded({extended: true}));
//for overriding post method with put/delete in forms
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.engine('ejs', ejsMate);
app.use(session({
    secret: 'shouldbeabettersecret',
    resave: false,
    saveUninitialized: true,    
    cookie: {
        //expires in a week from now (mlsec. sec, min, houres, days)
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7,
        //extra security, that user doesnt modify through browser or server
        httpOnly: true
    }    
  }));

//passport midlleware
app.use(passport.initialize());
//passport-session schould come after session!
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
//how to store a user in a session
passport.serializeUser(User.serializeUser());
//how to get that user out of the session
passport.deserializeUser(User.deserializeUser());

app.use(flash());

  //middleware for displaying flash messages or user
  app.use((req, res, next) => {
    //print the entire session
    //console.log(req.session);
    //access to currenUser in all templates
    res.locals.currentUser = req.user;
    res.locals.success =  req.flash('success');
    res.locals.error = req.flash('error');
    next();
  });

 //ROUTES
app.use('/parks', parkRoutes);
app.use('/parks/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

//LANDING ROUTE - home page
app.get('/', (req, res)=>{
    res.render('home');
});

//TEST -create a new park and add it to db
/* app.get('/makecampground', async (req, res) =>{
    const park = new Park({title: 'Joshua Tree', location: 'California'});
    await park.save();   
    res.send(park);
}); */

/* app.get('/fakeuser', async(req, res) => {
    const user = new User({
        email: 'colt@gmail.com',
        username: 'colt'
    });
    const newUser = await User.register(user, 'coltpassword');
    //newUser object will include id, email, username, salt, hash
    res.send(newUser);
}); */

//for every single request/path, if nothing before didn't match
//order is important! put this at the end
app.all('*', (req, res, next) =>{
    //res.send('404!!!!!');
    //use ExpressError meassage instead of generic error in app.use handler
    next(new ExpressError('Sorry. Page Not Found.', 404));
});

//GENERIC ERROR HANDLER
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh no, something went wrong!';
    //res.status(statusCode).send(message); 
    //render error.ejs -error template
    res.status(statusCode).render('error', {err});       
});

app.listen(3000, ()=> {
    console.log('Parks Server Has Started!');
});