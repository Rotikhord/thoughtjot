const pool = require('../database.js');
const debug = require('../debug.js');

/****************************************************************
 * A template for the jot object
 ****************************************************************/
function Jot(){
  this.pk;
  this.user_id;
  this.entry_date;
  this.text;
  this.isshared;
}

/****************************************************************
 * Returns an AutoSaved Jot
 ****************************************************************/
async function getAuto5SavedJot (userID){
  var sql = "SELECT user_pk, user_username, user_fname, user_lname, user_email, user_hash, user_signup, user_username, user_last_signin, user_security_question, user_security_answer FROM users WHERE user_email=$1::text";
  var params = [email]; 
  var results = await pool.query(sql, params);
  return parseUserfromDB(results.rows[0]);
}



/****************************************************************
 * Returns the 10 most recent Jots with a given tag
 ****************************************************************/
async function getRecentJots(userID, tag){
  var sql = "SELECT user_pk, user_username, user_fname, user_lname, user_email, user_hash, user_signup, user_username, user_last_signin, user_security_question, user_security_answer FROM users WHERE user_username=$1::text";
  var params = [username]; 
  var results = await pool.query(sql, params);
  return parseUserfromDB(results.rows[0]);
}

/****************************************************************
 * Parses the database results into a JOT object
 ****************************************************************/
function parseJotsFromDB(userID){
  if(results == null || results == undefined){
    user == null;
  } else {
    var user = new User;
    user.pk = results.user_pk;
    user.username = results.user_username;
    user.fname = results.user_fname;
    user.lname = results.user_lname;
    user.email = results.user_email;
    user.hash = results.user_hash;
   user.signup = results.user_signup;
      user.last_signin = results.user_last_signin;
      user.security_question = results.user_security_question;
      user.security_answer = results.user_security_answer;
    }
    return user;    
  }


/****************************************************************
 * Returns a list of all keywords associated with a user.
 ****************************************************************/
async function getKeywords (id){
  var sql = "SELECT kword_pk, kword_name FROM keywords WHERE kword_user_fk=0 OR kword_user_fk=$1::int";
  var params = [id];
  var results = await pool.query(sql, params);
  var keywordArray = [];  
  for (var i = 0; i < results.rows.length; i++){
    keywordArray.push({id: results.rows[i].kword_pk, name: results.rows[i].kword_name});
 }
  return keywordArray;
}

/****************************************************************
 * Returns an AutoSaved Jot
 ****************************************************************/
async function getAutoSavedJot (id){
  var sql = "SELECT pending_text FROM pendingEntries WHERE pending_user_fk=$1::int";
  var params = [id]; 
  var results = await pool.query(sql, params);
  var text = '';
  if (results.rows.length > 0){
    text = results.rows[0].pending_text;
  }
  return text;
}

/****************************************************************
 * Drops existing autosave record and inserts a new one. 
 ****************************************************************/
async function insertAutoSavedJot (id, jot){
  //Delete exising saved entry first
  if (debug){console.log("insertAutoSavedJot() -> Called");}
  try{
    if (debug){console.log("insertAutoSavedJot() -> DELETE Call");}
    var sql = "DELETE FROM pendingEntries WHERE pending_user_fk=$1::int";
    var params = [id]; 
    await pool.query(sql, params);
    if (debug){console.log("insertAutoSavedJot() -> DELETE Return");}

  //Insert new autosaved entry
  if (debug){console.log("insertAutoSavedJot() -> INSERT Call");}
  var sql = "INSERT INTO pendingEntries (pending_user_fk, pending_text) VALUES ($1::int, $2::text)";
  params.push(jot);
  await pool.query(sql, params);
  if (debug){console.log("insertAutoSavedJot() -> INSERT Return");}
  } catch (err){
    if (debug){console.log("insertAutoSavedJot() -> ERROR CAUGHT");}
    console.log(err);
    return false;
  };
  if (debug){console.log("insertAutoSavedJot() -> Return TRUE");}
  return true;  
}

  module.exports = {
      Jot: Jot,
      getKeywords: getKeywords,
      getAutoSavedJot: getAutoSavedJot,
      insertAutoSavedJot: insertAutoSavedJot,
      getRecentJots: getRecentJots
  };