const pool = require('../database.js');
const debug = require('../debug.js');

/****************************************************************
 * A template for the comment object
 ****************************************************************/
function Comment(){
  this.id;
  this.user_id;
  this.entry_id;
  this.date;
  this.text;
}

/****************************************************************
 * Inserts a new comment into the database. 
 ****************************************************************/
async function insertNewComment (userID, comment){
    //Insert new autosaved entry
    if (debug){console.log("insertNewComment() -> Called");}
    try {
      var sql = "INSERT INTO comments (comment_entry_fk, comment_user_fk, comment_text) VALUES ($1::int, $2::int, $3::text) RETURNING comment_pk, comment_entry_fk, comment_user_fk, comment_date, comment_text";
      var params = [comment.jotID, userID, comment.text];
      var results = await pool.query(sql, params);
    } catch (err){
      if (debug){console.log("insertNewComment() -> ERROR CAUGHT");}
      console.log(err);
      return false;
    };
    return parseCommentFromDB(results.rows[0]);  
  }

  /****************************************************************
   * updates a comment record in the database. 
   ****************************************************************/
  async function updateComment(comment){
    //Insert new autosaved entry
    if (debug){console.log("updateComment() -> Called");}
    try {
      var sql = "UPDATE comments SET comment_text = $1::text WHERE comment_pk = $2::int AND  comment_entry_fk = $3::int RETURNING comment_pk, comment_entry_fk, comment_user_fk, comment_date, comment_text";
      var params = [comment.text, comment.id, comment.jotID];
      var results = await pool.query(sql, params);
    } catch (err){
      if (debug){console.log("updateComment() -> ERROR CAUGHT");}
      console.log(err);
      return false;
    };
    return parseCommentFromDB(results.rows[0]);  
  }

  

/****************************************************************
 * Returns all the comments for a give jot.
 ****************************************************************/
async function getAllComments(jotID){
  if (debug){console.log("getAllComments() -> Called");}
  var sql = "SELECT comment_pk, comment_entry_fk, comment_user_fk, comment_date, comment_text FROM comments WHERE comment_entry_fk=$1::int ORDER BY comment_pk ASC";
  var params = [jotID]; 
  var results = await pool.query(sql, params);
  var comments = [];
  for (var i = 0; i < results.rows.length; i++){
    comments.push(parseCommentFromDB(results.rows[i]));
  }
  console.log(comments);
  return comments;
}

/****************************************************************
 * Parses the database results into a JOT object
 ****************************************************************/
function parseCommentFromDB(results){  
  if (debug){console.log("parseCommentFromDB() -> Called");}
  if(results == null || results == undefined){
    var comment = null;
  } else {
    var comment = new Comment;
    comment.id = results.comment_pk;
    comment.user_id = results.comment_entry_fk;
    comment.entry_id = results.comment_user_fk;
    comment.date = results.comment_date;
    comment.text = results.comment_text;
    }
    return comment;    
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
      insertNewComment: insertNewComment,
      updateComment: updateComment,
      getAllComments: getAllComments
  };