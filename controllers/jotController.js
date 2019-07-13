const jotModel = require('../models/jotModel.js');
const commentModel = require('../models/commentModel.js')
const debug = require('../debug.js');
const utility = require('../utiltyMethods.js');

/****************************************************************
 * Returns newJotEntry ejs template (With autosaved material)
 ****************************************************************/
async function getNewEntry(request, response){
    var key = request.query.key;    
    if (debug){console.log("getNewEntry() -> Called");}
    var inactiveTags = await jotModel.getKeywords(key.id);
    var jot = await jotModel.getAutoSavedJot(key.id);
    response.render('partials/newEntry', { inactiveTags: inactiveTags, activeTags:[], jot: jot});  
}

/****************************************************************
 * Returns newJotEntry ejs template (with previously saved Jot)
 ****************************************************************/
async function editJot(request, response){
    var key = request.query.key;    
    var jotID = utility.validifyInt(request.query.jotID);
    if (debug){console.log("getNewEntry() -> Called");}
    var jot = await jotModel.getJot(key.id, jotID);
    var activeTags = await jotModel.getTags(jotID, true);
    var inactiveTags = await jotModel.getTags(jotID, false);
    response.render('partials/newEntry', { inactiveTags: inactiveTags, activeTags: activeTags, jot: jot});  
}


/****************************************************************
 * Returns the displayJot screen with the specified jot.
 ****************************************************************/
async function displayJot(request, response){
    var key = request.query.key;    
    var jotID = request.query.jotID;
    if (debug){console.log("displayJot() -> Called");}
    var jot = await jotModel.getJot(key.id, jotID);
    var activeTags = await jotModel.getTags(jotID, true);
    var comments = await commentModel.getAllComments(jotID);
    response.render('partials/jotView', { jot: jot, activeTags: activeTags, comments: comments});  
}

/****************************************************************
 * Returns a partial view of recent jots.
 ****************************************************************/
async function getFilteredJots(request, response){
    var key = request.query.key;    
    var tagID = utility.validifyInt(request.query.selection);
    if (debug){console.log("getFilteredJots() -> Called");}
    if (tagID == 0){
        var jots = await jotModel.getAllJots(key.id, tagID);
    } else {
        var jots = await jotModel.getJotsByTag(key.id, tagID);
    }
    var tags = await jotModel.getKeywords(key.id);
    response.render('partials/sidebar', { jots: jots, tags: tags, selection:tagID});  
}

/****************************************************************
 * Logic for auto-saving a jot. 
 ****************************************************************/
async function autoSaveJot(request, response){
    var key = request.body.key;
    var jot = request.body.jot;
    if (debug){console.log("autoSaveJot() -> Called");}
    if (await jotModel.insertAutoSavedJot(key.id, jot)){
        if (debug){console.log("autoSaveJot() -> Returning SUCCESS");}
        response.write('Autosave successful'); 
    } else {
        if (debug){console.log("autoSaveJot() -> Returning ERROR SAVING RECORD");}
        response.write('Database Error');
    }
    response.send();
}

/****************************************************************
 * Logic for saving a jot. 
 ****************************************************************/
async function saveJot(request, response){
    var key = request.body.key;
    var activeTags = utility.validify(request.body.activeTags);
    var inactiveTags = utility.validify(request.body.inactiveTags);
    var jot = request.body.jot;
    var jotID = utility.validifyInt(request.body.jotID);
    var savedJot = {};
    //if 
    if (debug){console.log("saveJot() -> Called");}
    console.log(request.body);
    //if Jot id = 0 create new jot, otherwise update existing
    if (jotID == '0') {
        savedJot = await jotModel.insertNewJot(key.id, jot);
    } else {
        savedJot = await jotModel.updateJot(key.id, jotID, jot);
    }
    activeTags = await updateKeywords(key.id, activeTags);
    //Add keywords if necessary. 
    updateJotTags(jotID, activeTags, inactiveTags);
    //Send the jotID of the saved jot. 
    if (Number.isInteger(savedJot.pk)){
        response.status(202).json(savedJot.pk);
    } else {
        response.status(400).end();
    }
    //Clear the autosave when a manual save is performed.  
    jotModel.dropAutoSavedJot(key.id);
}

/****************************************************************
 * checks keywords and adds them to the database if necesary. 
 ****************************************************************/
async function updateKeywords (userID, activeTags){
    if (debug){console.log("updateKeywords() -> Called");}
    for (i = 0; i < activeTags.length; i++){
        if (activeTags[i].id == '0'){
            activeTags[i] = await jotModel.insertKeyword(userID, activeTags[i].name);
        }
    }
    console.log(activeTags);
    return activeTags
}

/****************************************************************
 * Loops through the tags assigned to a JOT and inserts them into the table. 
 ****************************************************************/
function updateJotTags (jotID, activeTags, inactiveTags){
    for (i = 0; i < activeTags.length; i++){
        jotModel.updateTag(activeTags[i].id, jotID);
    }
    for (i = 0; i < inactiveTags.length; i++){
        jotModel.dropTag(inactiveTags[i].id, jotID);
    }
    return; 
}

/****************************************************************
 * Confirms a jot is owned by a given user.
 ****************************************************************/
async function confirmJot(userID, jotID){
    if (debug){console.log("confirmJot() -> Called");}
    //Get matching jot.
    var jot = await jotModel.getJot(userID, jotID);
    if (jot == null){
        //Jot doesn't exist or is owned by someone else
        return false;
    } else {
        //Jot is valid
        return true;
    }
}



module.exports = {
    getNewEntry: getNewEntry,
    autoSaveJot: autoSaveJot,
    saveJot: saveJot,
    editJot: editJot,
    displayJot: displayJot,
    getFilteredJots: getFilteredJots,
    confirmJot: confirmJot
};