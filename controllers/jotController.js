const jotModel = require('../models/jotModel.js');
const sessionController = require('./sessionController.js')


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
    console.log(request.body);
    if (await sessionController.verifySession(key.id, key.key) == true){
        if (await jotModel.insertAutoSavedJot(key.id, jot)){
            response.write('Autosave successful'); 
        } else {
            console.log("Error autosaving record");
            response.write('Database Error');
        }
    } else {
        response.write('Error: Invalid Session');
        console.log('Invalid Session');
    }    
}

module.exports = {
    getNewEntry: getNewEntry,
    autoSaveJot: autoSaveJot
};