
var interval = 1000;
var intervalFunction;
var lastSavedJot = '';
var serverKey = '';

    //intervalFunction =  setInterval(autoSave, interval);


/**********************************************
 * This function handles the initial loading of the page
 **********************************************/
function onLoad(){
    serverKey = localStorage.getItem('serverKey');
    if (serverKey == null || serverKey == undefined){
        getLoginScreen();
    } else {
        authenticateSession();
    }
}

/***************************************************************
 * This function queries to server and checks to see if session if valid
 ***************************************************************/
function authenticateSession(){}


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
        console.log('data: ' + data + '\nstatus: ' + status);
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
        }
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
            setTimeout(getLoginScreen, 5000);
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
        lastSavedJot = jot;
        $.post('/autoSaveJot', jot, function(data, status) { console.log('Status: ' + status); });
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