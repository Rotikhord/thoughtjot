const pool = require('../database.js');
const debug = require('../debug.js');

/****************************************************************
 * A template for the USER object
 ****************************************************************/
function User(){
    this.pk;
    this.username;
    this.email;
    this.fname;
    this.lname;
    this.hash;
    this.signup;
    this.last_signin;
    this.security_question;
    this.security_answer;
  }

 /****************************************************************
   * Queries the database for a user using an id
   ****************************************************************/
  async function getUserById(id){
    var sql = "SELECT user_pk, user_username, user_fname, user_lname, user_email, user_hash, user_signup, user_username, user_last_signin, user_security_question, user_security_answer FROM users WHERE user_pk=$1::int";
    var params = [id]; 
    var results = await pool.query(sql, params);
    return parseUserfromDB(results.rows[0]);
  }

  /****************************************************************
   * Queries the database for a user using an email
   ****************************************************************/
  async function getUserByEmail(email){
    var sql = "SELECT user_pk, user_username, user_fname, user_lname, user_email, user_hash, user_signup, user_username, user_last_signin, user_security_question, user_security_answer FROM users WHERE user_email=$1::text";
    var params = [email]; 
    var results = await pool.query(sql, params);
    return parseUserfromDB(results.rows[0]);
  }

  /****************************************************************
   * Queries the database for a user using an email
   ****************************************************************/
  async function getUserByUsername(username){
    var sql = "SELECT user_pk, user_username, user_fname, user_lname, user_email, user_hash, user_signup, user_username, user_last_signin, user_security_question, user_security_answer FROM users WHERE user_username=$1::text";
    var params = [username]; 
    var results = await pool.query(sql, params);
    return parseUserfromDB(results.rows[0]);
  }

/****************************************************************
 * Inserts a USER into the database
 ****************************************************************/
async function insertNewUser(user){
  if (debug){console.log("insertNewUser() -> Called");}
  var sql = "INSERT INTO users (user_username, user_fname, user_lname, user_email, user_hash, user_signup, user_last_signin, user_security_question, user_security_answer)" + 
    "VALUES ($1::text, $2::text, $3::text, $4::text, $5::text, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $6::text, $7::text) RETURNING user_username, user_fname, user_lname, user_email, user_hash, user_signup, user_last_signin, user_security_question, user_security_answer, user_pk, user_signup, user_last_signin";
    var params = [user.username, user.fname, user.lname, user.email, user.hash, user.security_question, user.security_answer];
    var results = await pool.query(sql, params);
    return parseUserfromDB(results.rows[0]);
  }

  /****************************************************************
   * Parses database results into a USER object
   ****************************************************************/
  function parseUserfromDB(results){
    if(results == null || results == undefined){
      user = null;
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


  


  module.exports = {
      User: User,
      getUserByEmail: getUserByEmail,
      getUserById: getUserById,
      getUserByUsername: getUserByUsername,
      insertNewUser: insertNewUser
  };