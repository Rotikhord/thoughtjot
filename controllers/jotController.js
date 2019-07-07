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
        response.render('partials/newEntry', { tags: tags, autoSave: autoSave});  
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

module.exports = {
    getNewEntry: getNewEntry,
    autoSaveJot: autoSaveJot
};