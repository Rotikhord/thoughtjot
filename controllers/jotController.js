const jotModel = require('../models/jotModel.js');
const sessionController = require('./sessionController.js')
const debug = require('../debug.js');

/****************************************************************
 * Returns newJotEntry ejs template (With autosaved material)
 ****************************************************************/
async function getNewEntry(request, response){
    var key = request.query;
    console.log(request.query);
    if (await sessionController.verifySession(key.id, key.key) == true){
        var tags = await jotModel.getKeywords(key.id);
        var autoSave = await jotModel.getAutoSavedJot(key.id);
        response.render('partials/newEntry', { unAppliedTags: tags, appliedTags:[], autoSave: autoSave});  
    } else {
        console.log('key does not match');
    }    
}

/****************************************************************
 * Logic for auto-saving a jot. 
 ****************************************************************/
async function autoSaveJot(request, response){
    var key = request.body.key;
    var jot = request.body.jot;
    if (debug){console.log("autoSaveJot() -> Called");}
    response.write('Autosave successful'); 
    
    if (await sessionController.verifySession(key.id, key.key) == true){
        if (await jotModel.insertAutoSavedJot(key.id, jot)){
            if (debug){console.log("autoSaveJot() -> Returning SUCCESS");}
            response.write('Autosave successful'); 
        } else {
            if (debug){console.log("autoSaveJot() -> Returning ERROR SAVING RECORD");}
            response.write('Database Error');
        }
    } else {
        if (debug){console.log("autoSaveJot() -> Returning INVALID SESSION");}
        response.write('Invalid Session');
    } 
    //This is key to prevent the posts from hanging. 
    response.send();
}

/****************************************************************
 * Logic for saving a jot. 
 ****************************************************************/
async function saveJot(request, response){
    var key = request.body.key;
    var tags = request.body.tags;
    var jot = request.body.jot;
    var jotID = request.body.jotID;
    if (debug){console.log("saveJot() -> Called");}
    //verify session
    if (await sessionController.verifySession(key.id, key.key)){
        var savedJot = {};
        if (jotID == '0') {
            //Save the Jot
            savedJot = await jotModel.insertNewJot(key.id, jot);
            jotID = savedJot.pk;
        } else {
            //TODO - add UPDATE Functionality
        }
        tags = await updateKeywords(key.id, tags);
        //Add keywords if necessary. 
        console.log(jot)
        await updateJotTags(jotID, tags);

    } else {
        if (debug){console.log("saveJot() -> Returning INVALID SESSION");}
        response.write('Invalid Session');
    } 
    //This is key to prevent the posts from hanging. 
    response.send();
}

/****************************************************************
 * checks keywords and adds them to the database if necesary. 
 ****************************************************************/
async function updateKeywords (userID, keywords){
    console.log(keywords);
    for (i = 0; i < keywords.length; i++){
        if (keywords[i].id == '0'){
            keywords[i] = await jotModel.insertKeyword(userID, keywords[i].name);
        }
    }
    console.log(keywords);
    return keywords
}

/****************************************************************
 * Loops through the tags assigned to a JOT and inserts them into the table. 
 ****************************************************************/
async function updateJotTags (jotID, keywords){
    for (i = 0; i < keywords.length; i++){
        await jotModel.updateTag(keywords[i].id, jotID);
    }
    return;
}




module.exports = {
    getNewEntry: getNewEntry,
    autoSaveJot: autoSaveJot,
    saveJot: saveJot
};