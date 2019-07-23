
const sessionModel = require('../models/sessionModel.js');
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');
const debug = require('../debug.js');

 /****************************************************************
   * Logic to create new sessions
   ****************************************************************/
async function createSession(userID){    
    if (debug){console.log("createSession() -> Called");}
    console.log(userID);
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
    if (debug){console.log("verifySession() -> Called");}
    const HOUR = 1000; //1 hour in ms.  
    serverKey = await sessionModel.getSessionKey(userID);
    if (serverKey == null || serverKey == undefined || clientKey != serverKey.key){
        if (debug){console.log("verifySession() -> Returning FALSE");}
        return false;
    } else if (((new Date) - serverKey.date) > HOUR) {
        sessionModel.deleteSessionKey(userID);
        if (debug){console.log("verifySession() -> Returning FALSE");}
        
        console.log((new Date) - serverKey.date);
        console.log((new Date));
        console.log(serverKey.date);
        console.log('minutes = ' + ((new Date - serverKey.date) /1000/60));
        console.log('hours = ' + ((new Date - serverKey.date) /60/1000/60));
        return false;
    } else {
        if (debug){console.log("verifySession() -> Returning TRUE");}
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