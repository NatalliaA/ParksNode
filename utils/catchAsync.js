//func- to pass any async function from ROUTES

module.exports = func => {
    //returns a new function that executes func
    return(req, res, next) =>{
        //if the is an error in the async func, next will run te error handler app.use
        func(req, res, next).catch(next);
    }
};