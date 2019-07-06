const pool = require('../database.js');

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
   * Parses database results into a USER object
   ****************************************************************/
  function parseUserfromDB(results){
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


  


  module.exports = {
      User: User,
      getUserByEmail: getUserByEmail,
      getUserByUsername: getUserByUsername
  };