// JavaScript source code
// variable preparation
const express = require('express');
const session =  require('express-session');
const uuid = require('uuid/v4');
const app = express();
var port = process.env.PORT || 5000;
const bodyParser =require('body-parser');

//Controllers
const userController = require('./controllers/userController.js');
const jotController = require('./controllers/jotController.js');
const commentController = require('./controllers/commentController.js');
const sessionController = require('./controllers/sessionController.js');
const debug = require('./debug.js');

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static('public'));
// VIEW
//app.set('views', 'view-access');
app.set('view engine', 'ejs');


// CONTROL
//TODO prevent signed in users from accessing login or sign-up page.
app.get('/login', function(request, response) {
  response.render('partials/login', { message: "" });
});
app.get('/signup', function(request, response) {
  response.render('partials/signup', { message: "" });
});

app.get('/getFilteredJots', authenticate, jotController.getFilteredJots);
app.get('/newEntry', authenticate, jotController.getNewEntry);
app.get('/editJot', authenticate, jotController.editJot);
app.get('/displayJot', authenticate, jotController.displayJot);
app.post('/autoSaveJot', authenticate, jotController.autoSaveJot);
app.post('/saveJot', authenticate, jotController.saveJot);
app.post('/saveComment', authenticate, commentController.saveComment);
app.post('/login', userController.login);
app.post('/signup', userController.signup);
app.post('/verifySession', authenticate, userController.verifySession)


//get home by default. 
app.get('/home', getHome);
app.get('/', getHome);

// Have Control listening on PORT()
app.listen(port, function () {
  console.log(`The server is listening on PORT ${port}`)
});

/***********************************************************
 * Middleware function that handles session key authenication 
 ***********************************************************/
async function authenticate(request, response, next){
  if (debug){console.log("authenticate() -> Called");}
  if (request.method == 'POST'){
    var key = request.body.key;
  } else {
    var key = request.query.key;
  }
  if (await sessionController.verifySession(key.id, key.key) == true){
    if (debug){console.log("authenticate() -> Success");}
    next();
  } else {
    if (debug){console.log("authenticate() -> Failed");}
    response.status(401).end();
    response.send();    
  }
}

/************************************************************
 * Simple function to re-route users looking for home
 ***********************************************************/
function getHome(request, response){
   response.redirect('/home.html');
}




