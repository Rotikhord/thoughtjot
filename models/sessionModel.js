const pool = require('../database.js');

/****************************************************************
 * A template for the Session verification object
 ****************************************************************/
function SessionKey(){
    this.id;
    this.key;
    this.date;
  }

/*****************************************************************
 * Get a session from the database
 *****************************************************************/
async function getSessionKey(id){
  var sql = "SELECT key_user_fk, key_key, key_created FROM keys WHERE key_user_fk=$1::int";
  var params = [id]; 
  var results = await pool.query(sql, params);
  return parseSessionKeyFromDB(results.rows[0]);
}

/*****************************************************************
 * Add a new session to the database
 *****************************************************************/
async function insertSessionKey(id, key){
  var sql = "INSERT INTO keys (key_user_fk, key_key) VALUES ($1::int, $2::text) RETURNING key_user_fk, key_key, key_created";
  var params = [id, key]; 
  var results = await pool.query(sql, params);
  return parseSessionKeyFromDB(results.rows[0]);
}

/****************************************************************
 * Delete an existing session.
 ****************************************************************/
async function deleteSessionKey(id){
  var sql = "DELETE FROM keys WHERE key_user_fk=$1::int";
  var params = [id]; 
  var results = await pool.query(sql, params);
  return results;
}


/****************************************************************
 * Parses database results into a SessionKey object
 ****************************************************************/
function parseSessionKeyFromDB(results){
  if(results == null || results == undefined){
    var sessionKey = null;
  } else {
    var sessionKey = new SessionKey;
    sessionKey.id = results.key_user_fk;
    sessionKey.key = results.key_key;
    sessionKey.date = new Date(results.key_created);
  }
  return sessionKey;    
}

module.exports = {
    SessionKey: SessionKey,
    getSessionKey: getSessionKey,
    insertSessionKey: insertSessionKey,
    deleteSessionKey: deleteSessionKey
};