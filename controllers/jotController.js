const jotModel = require('../models/jotModel.js');
//const sessionController = require('./sessionController.js')
const debug = require('../debug.js');
const utility = require('../utiltyMethods.js');

/****************************************************************
 * Returns newJotEntry ejs template (With autosaved material)
 ****************************************************************/
async function getNewEntry(request, response){
    var key = request.query.key;    
    if (debug){console.log("getNewEntry() -> Called");}
    var tags = await jotModel.getKeywords(key.id);
    var autoSave = await jotModel.getAutoSavedJot(key.id);
    response.render('partials/newEntry', { unAppliedTags: tags, appliedTags:[], autoSave: autoSave});  
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
    response.render('partials/jotView', { jot: jot, activeTags:activeTags});  
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
    var jotID = request.body.jotID;
    var savedJot = {};
    //if 
    if (debug){console.log("saveJot() -> Called");}
    console.log(request.body);
    //if Jot id = 0 create new jot, otherwise update existing
    if (jotID == '0') {
        savedJot = await jotModel.insertNewJot(key.id, jot);
        jotID = savedJot.pk;
    } else {
        //TODO - add UPDATE Functionality
    }
    activeTags = await updateKeywords(key.id, activeTags);
    //Add keywords if necessary. 
    updateJotTags(jotID, activeTags, inactiveTags);
    //Send the jotID of the saved jot. 
    if (Number.isInteger(jotID)){
        response.status(202).json(jotID);
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




module.exports = {
    getNewEntry: getNewEntry,
    autoSaveJot: autoSaveJot,
    saveJot: saveJot,
    displayJot: displayJot
};