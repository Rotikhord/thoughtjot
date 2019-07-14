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
 * Returns a list of keyworkds based on parameters
 ****************************************************************/
async function getTags (jotID, userID, active){  
  if (debug){console.log("getTags() -> Called");}
  var sqlModifier = '';
  if (!active){
    sqlModifier = ' NOT ';
  }
  var sql = "SELECT kword_pk, kword_name FROM keywords WHERE " + sqlModifier + " EXISTS (SELECT tag_pk FROM tags WHERE kword_pk = tag_kword_fk AND tag_entry_fk=$1::int) AND (kword_user_fk=0 OR kword_user_fk=$2::int)";
  var params = [jotID, userID];
  return await getKeywordsFromDB(sql, params);
}

/****************************************************************
 * Retrieves keywords form db and parses results into array. 
 ****************************************************************/
async function getKeywordsFromDB(sql, params){
  if (debug){console.log("getKeywordsFromDB() -> Called");}
  var results = await pool.query(sql, params);
  var keywordArray = [];  
  for (var i = 0; i < results.rows.length; i++){
    keywordArray.push({id: results.rows[i].kword_pk, name: results.rows[i].kword_name});
 }
  return keywordArray;
}

/****************************************************************
 * Returns Jots tagged with a specific tag
 ****************************************************************/
async function getJotsByTag(userID, tagID){
  if (debug){console.log("getJotsByTag() -> Called");}
  var sql = "SELECT entry_pk, entry_user_fk, entry_date, entry_text, entry_isshared FROM entries WHERE entry_user_fk=$1::int AND EXISTS (SELECT tag_pk FROM tags WHERE entry_pk = tag_entry_fk AND tag_kword_fk=$2::int) ORDER BY entry_pk DESC";
  var params = [userID, tagID]; 
  var results = await pool.query(sql, params);
  var jots = [];
  for (var i = 0; i < results.rows.length; i++){
    jots.push(parseJotsFromDB(results.rows[i]));
  }
  console.log(jots);
  return jots;
}

/****************************************************************
 * Returns the specified jot
 ****************************************************************/
async function getJot(userID, jotID){  
  if (debug){console.log("getJot() -> Called");}
  var sql = "SELECT entry_pk, entry_user_fk, entry_date, entry_text, entry_isshared FROM entries WHERE entry_pk=$1::int AND entry_user_fk=$2::int";
  var params = [jotID, userID]; 
  var results = await pool.query(sql, params);
  return parseJotsFromDB(results.rows[0]);
}

/****************************************************************
 * Returns all the jots for a user
 ****************************************************************/
async function getAllJots(userID){
  if (debug){console.log("getJotsByTag() -> Called");}
  var sql = "SELECT entry_pk, entry_user_fk, entry_date, entry_text, entry_isshared FROM entries WHERE entry_user_fk=$1::int ORDER BY entry_pk DESC";
  var params = [userID]; 
  var results = await pool.query(sql, params);
  var jots = [];
  for (var i = 0; i < results.rows.length; i++){
    jots.push(parseJotsFromDB(results.rows[i]));
  }
  console.log(jots);
  return jots;
}

/****************************************************************
 * Parses the database results into a JOT object
 ****************************************************************/
function parseJotsFromDB(results){  
  if (debug){console.log("parseJotsFromDB() -> Called");}
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
    return jot;    
  }


/****************************************************************
 * Returns a list of all keywords associated with a user.
 ****************************************************************/
async function getKeywords (id){
  var sql = "SELECT kword_pk, kword_name FROM keywords WHERE kword_user_fk=0 OR kword_user_fk=$1::int";
  var params = [id];
  return await getKeywordsFromDB(sql, params);
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
  jot = new Jot;
  jot.pk = 0;
  jot.text = text;
  return jot;
}

/****************************************************************
 * Drops existing autosave record and inserts a new one. 
 ****************************************************************/
async function insertAutoSavedJot (id, jot){
  //Delete exising saved entry first
  if (debug){console.log("insertAutoSavedJot() -> Called");}
  await dropAutoSavedJot(id);
  try{
    //Insert new autosaved entry
    if (debug){console.log("insertAutoSavedJot() -> INSERT Call");}
    var sql = "INSERT INTO pendingEntries (pending_user_fk, pending_text) VALUES ($1::int, $2::text)";
    var params = [id, jot];
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
 * Drops existing autosave record 
 ****************************************************************/
async function dropAutoSavedJot (id){
  //Delete exising saved entry first
  if (debug){console.log("dropAutoSavedJot() -> Called");}
  try{
    if (debug){console.log("dropAutoSavedJot() -> DELETE Call");}
    var sql = "DELETE FROM pendingEntries WHERE pending_user_fk=$1::int";
    var params = [id]; 
    await pool.query(sql, params);
    if (debug){console.log("dropAutoSavedJot() -> DELETE Return");}

  } catch (err){
    if (debug){console.log("dropAutoSavedJot() -> ERROR CAUGHT");}
    console.log(err);
    return false;
  };
  if (debug){console.log("dropAutoSavedJot() -> Return TRUE");}
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
 * Inserts a new JOT into the database. 
 ****************************************************************/
async function updateJot(userID, jotID, jot){
  //Insert new autosaved entry
  if (debug){console.log("updateJot() -> INSERT Call");}
  try {
    var sql = "UPDATE entries SET entry_text = $1::text WHERE entry_user_fk = $2::int AND  entry_pk = $3::int RETURNING entry_pk, entry_user_fk, entry_date, entry_text, entry_isshared";
    var params = [jot, userID, jotID];
    var results = await pool.query(sql, params);
  } catch (err){
    if (debug){console.log("updateJot() -> ERROR CAUGHT");}
    console.log(err);
    return false;
  };
  return parseJotsFromDB(results.rows[0]);  
}

/****************************************************************
 * Update or insert tag record. 
 ****************************************************************/
async function updateTag (keyword, jot){
  if (debug){console.log("updateTag() -> Called");}
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

/****************************************************************
 * Delete a stored tag. 
 ****************************************************************/
async function dropTag (keyword, jot){
  //Insert new autosaved entry
  if (debug){console.log("dropTag() -> Called");}
  try {
    var sql = "DELETE FROM tags where tag_kword_fk = $1::int AND tag_entry_fk = $2::int";
    var params = [keyword, jot];
    results = await pool.query(sql, params);    
  } catch (err){
    if (debug){console.log("dropTag() -> ERROR CAUGHT");}
    console.log(err);
    return false;
  };
  return;
}

  module.exports = {
      Jot: Jot,
      getKeywords: getKeywords,
      getAutoSavedJot: getAutoSavedJot,
      getTags: getTags,
      getJot: getJot,
      updateJot: updateJot,
      getJotsByTag: getJotsByTag,
      getAllJots: getAllJots,
      insertAutoSavedJot: insertAutoSavedJot,
      dropAutoSavedJot: dropAutoSavedJot,
      insertNewJot: insertNewJot,
      insertKeyword: insertKeyword,
      updateTag: updateTag,
      dropTag: dropTag
  };