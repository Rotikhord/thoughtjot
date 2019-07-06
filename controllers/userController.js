
const userModel = require('../models/userModel.js');
const bcrypt = require('bcrypt');

 /****************************************************************
   * Logic to handle login attempts
   ****************************************************************/
async function login(request, response){
    console.log(request.body);
    //Logic to determine whether to search for user by username or email.
    if (request.body.username.match(/@/)){
        var user = await userModel.getUserByEmail(request.body.username);
    } else {       
        var user = await userModel.getUserByUsername(request.body.username);
    }
    //Compare passwords
    if (await verifyPassword(request.body.password, user.hash)){
        console.log('correct password');
    } else {
        response.send({result: 'failed', message: "Invalid username or password"})
    }

}

 /****************************************************************
   * Check for a password match
   ****************************************************************/
async function verifyPassword(password, hash){
    return await bcrypt.compare(password, hash);
}
  


  module.exports = {
      login: login
  };