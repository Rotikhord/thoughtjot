
const userModel = require('../models/userModel.js');
const sessionController = require('./sessionController.js')
const debug = require('../debug.js');
const bcrypt = require('bcrypt');

/****************************************************************
 * Logic to handle login attempts
 ****************************************************************/
async function login(request, response){
    if (debug){console.log("login() -> Called");}
    //Logic to determine whether to search for user by username or email.
    if (request.body.username.match(/@/)){
        var user = await userModel.getUserByEmail(request.body.username);
    } else {       
        var user = await userModel.getUserByUsername(request.body.username);
    }
    //Compare passwords
    if (await verifyPassword(request.body.password, user.hash)){
        //Successful Sign in
        sessionKey = await sessionController.createSession(user.pk);
        response.send({result: 'success', message:'Sign-In Successful', sessionKey: sessionKey, user: user});
    } else {
        //un-Successful Sign In
        response.send({result: 'failed', message: "Invalid username or password"})
    }

}

/****************************************************************
 * Parses user data from request and returns USER object
 ****************************************************************/
function parseUserFromRequest(data){
    var user = new userModel.User;
    user.pk = 0;
    user.username = data.username;
    user.email= data.email;
    user.fname= data.fname;
    user.lname= data.lname;
    user.hash= data.password;
    user.security_question= data.question;
    user.security_answer= data.answer;
    return user;
}

/****************************************************************
 * Logic to handle sign up attempts
 ****************************************************************/
async function signup(request, response){
    if (debug){console.log("signup() -> Called");}
    var user = parseUserFromRequest(request.body);    
    console.log(user);

    //verify that the username or passwords don't already exist.
    var emailUser = await userModel.getUserByEmail(user.email);
    var namedUser = await userModel.getUserByUsername(user.username);
    if(emailUser != null || namedUser != null){
        response.status(400).send({message: 'Username or Email already exists'});
        return;
    } else {
        user.hash = await bcrypt.hash(user.hash, 10);
        console.log('CREATE USER');
        console.log(user.hash);
        user = await userModel.insertNewUser(user);
    }
    
    //Respond to client
    if (user != null){
        console.log(user);
        console.log('USERPK = ' + user.pk);
        sessionKey = await sessionController.createSession(user.pk);
        response.status(201).send({result: 'success', sessionKey: sessionKey, user: user});
    } else {
        response.status(500).send({message: 'Server Error: Please try again later.'});
    }
}

 /****************************************************************
   * Check for a password match
   ****************************************************************/
async function verifyPassword(password, hash){
    return await bcrypt.compare(password, hash);
}


  module.exports = {
      login: login,
      signup: signup
  };