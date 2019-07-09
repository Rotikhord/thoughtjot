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
function parseJotsFromDB(results){
  if(results == null || results == undefined){
    var jot = null;
  } else {
    var jot = new Jot;
    jot.pk = results.entry_pk;
    jot.user_id = results.entry_user_fk;
    jot.entry_date = results.entry_date;
    jot.text = results.entry_text;
    jot.isshared = results.entry_isshared;
    }
    console.log(jot);
    return jot;    
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
 * Check if a keyword exists for a user and if not, add it
 ****************************************************************/
async function insertKeyword (id, name){
  var sql = "SELECT kword_pk FROM keywords WHERE (kword_user_fk=0 OR kword_user_fk=$1::int) AND kword_name=$2::text";
  var params = [id, name];
  var results = await pool.query(sql, params);
  if (results.rows == 0){
    sql = "INSERT INTO keywords (kword_user_fk, kword_name) VALUES ($1::int, $2::text) RETURNING kword_pk";
    var results = await pool.query(sql, params);
  }
  var keyword = {id: results.rows[0].kword_pk, name: name };
  return keyword;
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

/****************************************************************
 * Inserts a new JOT into the database. 
 ****************************************************************/
async function insertNewJot (id, jot){
  //Insert new autosaved entry
  if (debug){console.log("insertNewJot() -> INSERT Call");}
  try {
    var sql = "INSERT INTO entries (entry_user_fk, entry_text) VALUES ($1::int, $2::text) RETURNING entry_pk, entry_user_fk, entry_date, entry_text, entry_isshared";
    var params = [id, jot];
    var results = await pool.query(sql, params);
    if (debug){console.log("insertNewJot() -> INSERT Return");}
  } catch (err){
    if (debug){console.log("insertNewJot() -> ERROR CAUGHT");}
    console.log(err);
    return false;
  };
  if (debug){console.log("insertNewJot() -> Return TRUE");}
  return parseJotsFromDB(results.rows[0]);  
}

/****************************************************************
 * Update or insert tag record. 
 ****************************************************************/
async function updateTag (keyword, jot){
  //Insert new autosaved entry
  if (debug){console.log("updateTag() -> INSERT Call");}
  console.log(keyword);
  console.log(jot);
  try {
    var sql = "SELECT tag_pk  FROM tags where tag_kword_fk = $1::int AND tag_entry_fk = $2::int";
    var params = [keyword, jot];
    results = await pool.query(sql, params);
    if (results.rows == 0){
      sql = "INSERT INTO tags (tag_kword_fk, tag_entry_fk) VALUES ($1::int, $2::int) RETURNING tag_pk";
      await pool.query(sql, params);
    } 
    
  } catch (err){
    if (debug){console.log("insertNewJot() -> ERROR CAUGHT");}
    console.log(err);
    return false;
  };
  return;
}

  module.exports = {
      Jot: Jot,
      getKeywords: getKeywords,
      getAutoSavedJot: getAutoSavedJot,
      insertAutoSavedJot: insertAutoSavedJot,
      insertNewJot: insertNewJot,
      insertKeyword: insertKeyword,
      updateTag: updateTag,
      getRecentJots: getRecentJots
  };