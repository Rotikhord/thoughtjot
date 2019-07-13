const commentModel = require('../models/commentModel.js');
const jotController = require('../controllers/jotController.js');
const debug = require('../debug.js');
const utility = require('../utiltyMethods.js');

/****************************************************************
 * Logic for saving/updating a comment
 ****************************************************************/
async function saveComment(request, response){    
    if (debug){console.log("saveCommment() -> Called");
}
    var key = request.body.key;
    var comment = request.body.comment;    
    var savedComment = {};

    //Make sure parent jot is valid
    if (! await jotController.confirmJot(key.id, comment.jotID)){
        response.status(404).end();
        return;
    } 
    if (comment.id == '0') {
        savedComment = await commentModel.insertNewComment(key.id, comment);
    } else {
        savedComment = await commentModel.updateComment(comment);
    }

    //Send the jotID of the saved jot. 
    if (Number.isInteger(savedComment.id)){
        response.status(202).json(savedComment);
    } else {
        response.status(400).end();
    }
}

module.exports = {    
    saveComment: saveComment,  
};