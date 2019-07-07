
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
    $.get('/newEntry', sessionKey, function(data, status){
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
 * 
 ****************************************************************/

 /****************************************************************
 * 
 ****************************************************************/

 /****************************************************************
 * 
 ****************************************************************/

 /****************************************************************
 * 
 ****************************************************************/

 /****************************************************************
 * 
 ****************************************************************/

 /****************************************************************
 * 
 ****************************************************************/