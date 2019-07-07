
const sessionModel = require('../models/sessionModel.js');
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');

 /****************************************************************
   * Logic to create new sessions
   ****************************************************************/
async function createSession(userID){
    var sessionKey = await bcrypt.hash(uuid(), 1);
    await sessionModel.deleteSessionKey(userID);
    var keyObject = await sessionModel.insertSessionKey(userID, sessionKey);
    console.log(keyObject.date);
    return keyObject;
}


 /****************************************************************
   * Verify the session is valid
   ****************************************************************/
async function verifySession(userID, clientKey){
    const HOUR = 60 * 60 * 1000; //1 hour in ms.  
    serverKey = await sessionModel.getSessionKey(userID);
    if (serverKey == null || serverKey == undefined || clientKey != serverKey.key){
        return false;
    } else if (((new Date) - serverKey.date) > HOUR) {
        sessionModel.deleteSessionKey(userID);
        return false;
    } else {
        return true; 
    }
}

 /****************************************************************
   * Remove the session for the current user
   ****************************************************************/
  async function removeSession(userID){
    await deleteSessionKey(userID);
    return;
}


  module.exports = {
      createSession: createSession,
      verifySession: verifySession
  };