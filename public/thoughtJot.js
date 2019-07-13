
var interval = 2500;
var intervalFunction;
var lastSavedJot = '';
var sessionKey = '';
var user;

 


/**********************************************
 * This function handles the initial loading of the page
 **********************************************/
function onLoad(){
    sessionKey = localStorage.getItem('sessionKey');
    if (sessionKey == null || sessionKey == undefined){
        getLoginScreen();
    } else {
        authenticateSession();
    }
}

/***************************************************************
 * This function queries to server and checks to see if session if valid
 ***************************************************************/
function authenticateSession(){getLoginScreen();}


/***************************************************************
 * This function queries the server for the login sub-page
 ***************************************************************/
function getLoginScreen(){
    $.get('/login', function(data, status){
        if (status == 'success'){
            $('#contentArea').html(data);
        } else {
            $('#contentArea').append('<h4 style="text-align: center";> There was an error connecting to the server. Trying again in 5 seconds</h4>');
            setTimeout(getLoginScreen, 5000);
        }
    })
}

/***************************************************************
 * Uses AJAX to post form data to the server.
 **************************************************************/
function postForm(formID, callback){
    console.log('/'+formID);
   // console.log($('#' + formID).serialize());
    $.post('/' + formID, $('#' + formID).serialize(), function(data, status) {
        callback(data, status);
    });
}


/***************************************************************
 * Uses an AJAX post request to login to the application
 **************************************************************/
function signIn(element){
    postForm($(element).closest('form').attr('id'), function(data, status){
        if (data.result != 'success'){
            $('#formMessage').text(data.message);
        } else {
            initializeSession(data);
        }
    });
}

/**************************************************************
 * Initializes a local session. 
 **************************************************************/
function initializeSession(data){
    sessionKey = data.sessionKey;
    localStorage.setItem('sessionKey', sessionKey);
    user = data.user;

    //Display Welcome Message
    $('#welcomeMessage').text('Welcome ' + user.fname);

    //Show navbar & signout options
    $('#jotNavBar, #headerWelcome').show();

    //Get new entry screen by default
    getNewEntryScreen();

}

/***************************************************************
 * This function queries the server for the add new entry page
 ***************************************************************/
function getNewEntryScreen(){
    $.get('/newEntry', {key: sessionKey}, function(data, status){
        if (status == 'success'){
            $('#contentArea').html(data);
            clearInterval(intervalFunction);
            intervalFunction =  setInterval(autoSave, interval);
        } else {
            $('#contentArea').html('<h4 style="text-align: center";> There was an error connecting to the server. Redirecting to sign in screen</h4>');
            setTimeout(getLoginScreen, 5000);
        }
    })
}

/***************************************************************
 * This function queries the server for the add new entry page
 ***************************************************************/
function editJot(){
    var jotID = data = $('#jotArea').attr('data_tag_id');
    $.get('/editJot', {key: sessionKey, jotID: jotID}, function(data, status){
        if (status == 'success'){
            $('#contentArea').html(data);
        } 
    })
}

/***************************************************************
 * This function queries the server for the add new entry page
 ***************************************************************/
function displayJot(jotID){
    $.get('/displayJot', {key: sessionKey, jotID : jotID}, function(data){
        $('#contentArea').html(data);
    }).fail(function(jqXHR) {
        console.log(jqXHR.status);
        //TODO - if 401 - redirect to login 
        //TODO - if 404 - display not found
        //TODO - if 400 - display error message 
    }); 
}


/***************************************************************
 * This function queries the server for the signup sub-page
 ***************************************************************/
function getSignUpScreen(){
    $.get('/signup', function(data, status){
        if (status == 'success'){
            $('#contentArea').html(data);
        } else {
            $('#contentArea').append('<h4 style="text-align: center";> There was an error connecting to the server. Trying again in 5 seconds</h4>');
            setTimeout(getSignUpScreen, 5000);
        }
    })
}

/****************************************************************
 * This function checks the value of the textarea and saves it if
 * necessary.
 ****************************************************************/
function autoSave(){
    var jot = $('#jotArea').val();
    if (jot.length > 0 && lastSavedJot != jot){
        console.log('auto-saving');
        lastSavedJot = jot;
        $.post('/autoSaveJot', {jot: jot, key: sessionKey});// , function(data, status) { console.log('Status: ' + status); });
    }
}

/****************************************************************
 * This contains the logic for applying a tag to the new Jot.
 ****************************************************************/
function addTag(){
    //Store the value in variable & clear input field
    var value = $('#tagInput').val();
    $('#tagInput').val('');
    if (value != ''){
        data = removeTagFromOptions('inactiveTags', value);
        addTagToOptions('activeTags', value, data);
    }
}

/****************************************************************
 * This contains the logic for removing a tag from the new Jot.
 ****************************************************************/
function removeTag(){
    //Store the value in variable & clear input field
    var value = $("#activeTags option:selected").text();
    $('#activeTags option:eq(0)').prop('selected', true);
    if (value != $('#activeTags option:eq(0)').val()){
        data = removeTagFromOptions('activeTags', value);
        addTagToOptions('inactiveTags', value, data);
    }
}

 /****************************************************************
 * This function adds a tag to an option list.
 ****************************************************************/
function addTagToOptions(elementID, value, data){
    //Make sure the selected tag hasn't already been applied.
    var alreadyExists = false;
    $('#' + elementID + ' option').each(function(){
        if ($(this).val() == value || $(this).text() == value){
            alreadyExists = true;
        }
    })
    if (!alreadyExists){
        $('#' + elementID).append($('<option>', {value: value, text: value, data_tag_id: data}));
    }
}
 /****************************************************************
 * Remove a tag from an options list and returns the deleted item data
 ****************************************************************/
function removeTagFromOptions(elementID, value){
    var data = '0'; //Default value
    //Loop through options and delete the selected option if exists. 
    $('#' + elementID + ' option').each(function(){
        if ($(this).val() == value){
            data = $(this).attr('data_tag_id');
            $(this).remove();
        }
    })
    return data;
}

/***************************************************************
 * Uses AJAX to save a JOT & related tags to the server. 
 **************************************************************/
function saveJot(){
    var jotID = $('#jotArea').attr('data-jot-id');
    var jot = $('#jotArea').val();
    var activeTags = getTags('activeTags');
    var inactiveTags = getTags('inactiveTags');
    clearInterval(intervalFunction);
    if (jot.length > 0){
        $.post('/saveJot', {jotID: jotID, jot: jot, activeTags: activeTags, inactiveTags: inactiveTags, key: sessionKey}, function(data, status){ 
            displayJot(data);
        }).fail(function(jqXHR) {
            console.log(jqXHR.status);
            //TODO - If 401 - redirect to login 
            //TODO - if 400 - display error message 
        });
    }   
}

 /****************************************************************
 * Returns a list of applied tags.
 ****************************************************************/
function getTags(parentID){
    var tagList = [];
    $('#' + parentID + ' option').each(function(){
        if ($(this).val() != '0'){
            var tag = {id: $(this).attr('data_tag_id'), name: $(this).val()};
            tagList.push(tag);
        }
    })
    return tagList;
}
 /****************************************************************
 * 
 ****************************************************************/

 /****************************************************************
 * 
 ****************************************************************/