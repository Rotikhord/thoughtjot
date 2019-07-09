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
const autoSaveController = require('./controllers/autoSaveController.js');

app.use(bodyParser.urlencoded({extended : true}));
// static directory
app.use(express.static('public'));

// VIEW
//app.set('views', 'view-access');
app.set('view engine', 'ejs');


app.use(session({
  name: 'id',
  secret: uuid(),
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000
}));

// CONTROL
//TODO prevent signed in users from accessing login or sign-up page.
app.get('/login', function(request, response) {
  response.render('partials/login', { message: "" });
});
app.get('/signup', function(request, response) {
  response.render('partials/signup', { message: "" });
});

app.get('/newEntry', jotController.getNewEntry);
app.post('/autoSaveJot', jotController.autoSaveJot);
app.post('/saveJot', jotController.saveJot);

app.post('/login', userController.login);

app.post('/createAccount', accountCreation);
app.post('/authenticate', authenticate);

app.post('/test', function(request, response) {
  console.log('test called');
  response.send();
})

//get home by default. 
app.get('/home', getHome);
app.get('/', getHome);

// Have Control listening on PORT()
app.listen(port, function () {
  console.log(`The server is listening on PORT ${port}`)
});


function getHome(request, response){
  //if (request.session.user == undefined || request.session.user == null){
  //  response.redirect('/login');
  // } else {
    //Temp tags
   // var tags = ['Faith', 'Hope', 'Charity']
   // var params = { message: "Welcome " + request.session.user.fname + "!", tags: tags};    
   response.redirect('/home.html');
  //}
  
}

function accountCreation(request, response){
  console.log("****CALLED**** accountCreation()");
  var email = String(request.body.email);
  var username = String(request.body.username);
  //var weight = Number(request.query.weight);
  getDuplicateUsers(email, username, function(results){
    if(results.length != 0){
      console.log("Eventually will generate error message for user")
      createAccountResult(-1, response);
    }
    else {
      createAccount(request.body, response);
    }
  });
}

function createAccount(request, response){
  
  console.log("****CALLED**** createAccount()");
  var user = new userController.User;
  user.username = request.username.trim();
  user.email = request.email.trim();
  user.fname = request.fname.trim();
  user.lname = request.lname.trim();
  user.security_question = request.question.trim();
  user.security_answer = request.answer.trim();
  bcrypt.hash(request.password.trim(), 10, function(err, hash){
    console.log("the hashed password is" + hash);
    console.log("oringal password is: " + request.password);
    user.hash = hash;
    insertNewUser(user, function(result){
      createAccountResult(result, response);
    })
  });

}

function insertNewUser(user, callback){
  
  console.log("****CALLED**** insertNewUser()");
  var sql = "INSERT INTO users (user_username, user_fname, user_lname, user_email, user_hash, user_signup, user_last_signin, user_security_question, user_security_answer)" + 
    "VALUES ($1::text, $2::text, $3::text, $4::text, $5::text, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $6::text, $7::text) RETURNING user_pk, user_signup, user_last_signin";
  var params = [user.username, user.fname, user.lname, user.email, user.hash, user.security_question, user.security_answer];

  pool.query(sql, params, function(err, result) {
    // If an error occurred...
    if (err) {
        console.log("ERROR: insertNewUser(): ");
        console.log(err);
        callback(-2);
    }
    else {
      user.pk = result.rows[0].user_pk;
      user.signup = result.rows[0].user_signup;
      user.last_signin = result.rows[0].user_last_signin;
      console.log("COMPLETED USER:");
      console.log(user);
      callback(user);   
    }    
  });
}

function createAccountResult(result, response){
  
  console.log("****CALLED**** createAccountResult()");

  console.log("RESULT = " + result);
  //response.write("Displaying Result: " + result);
  var message = '';
  if (result == undefined || result == null){
    message = "An Error Occured";
  } else if (result == -1){
    message = "The username or email you entered has already been taken";
  } else if (result == -2){
    var params = { message: "All fields are required!" };    
    response.render('pages/signup', params);
    return;
  } else {
    message = "Account Created Successfully"
  }
  var params = { message: message};    
  response.render('partials/login', params);
}

function getDuplicateUsers(email, username, callback){
  var sql = "SELECT user_pk, user_email, user_username FROM users where user_email=$1::text OR user_username=$2::text";
  var params = [email, username]; 
  pool.query(sql, params, function(err, result) {
    if (err) {
        console.log("Error in getDuplicateUsers(" + email + ", " + username + "): ");
        console.log(err);
    }
    callback(result.rows);   
  });
}

function authenticate(request, response){

}



function verifyPassword(user, request, response){
  bcrypt.compare(request.body.password, user.hash, function(err, isMatch){
    if (isMatch){
      request.session.regenerate(function(err){
        request.session.user = user;
        console.log(request.session.user);
        response.redirect('/home');
      })
    } else {
      var params = { message: "Error: Incorrect username or password." };    
    response.render('partials/login', params);
    }
  })
}



