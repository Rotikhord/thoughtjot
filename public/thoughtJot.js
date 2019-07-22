
var interval = 2500;
var intervalFunction;
var lastSavedJot = '';
var sessionKey = '';
var user;

 


/**********************************************
 * This function handles the initial loading of the page
 **********************************************/
function onLoad(){    
    try{
        sessionKey = JSON.parse(localStorage.getItem('sessionKey'));
        if (sessionKey == null || sessionKey == undefined){
            getLoginScreen();
        } else {        
            authenticateSession();
        }
    } catch {
        getLoginScreen();
    }
}

/***************************************************************
 * This function queries to server and checks to see if session if valid
 ***************************************************************/
function authenticateSession(){
    $.post('/verifySession', {key: sessionKey}, function(data, status){
        if (data.result != 'success'){
            getLoginScreen();
        } else {
            initializeSession(data);
        }
    });
}

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
        console.log(data);
        console.log(status);
        callback(data, status);
    });
}


/***************************************************************
 * Uses an AJAX post request to login to the application
 **************************************************************/
function signIn(element){
    if (validateForm(element) && $(element).val() != 'Cancel'){
        postForm($(element).closest('form').attr('id'), function(data, status){
            console.log(data);
            if (data.result != 'success'){
                $('#formMessage').html(data.message);
                $('#formMessage').addClass('alert alert-danger pl-2')
            } else {
                console.log('test')
            initializeSession(data);
            }
        });
    }
}

/***************************************************************
 * Validates a form and ensures everything is filled in
 **************************************************************/
function validateForm(element){
    var field = $('fieldset');
    var isValid = true;
    field.children('input').each(function() {
        var label = $(this).prev().prev();
        if($(this).val() == '' && $(element).val() != 'Cancel'){
            isValid = false;
            label.text(label.attr('data_defaultTag') +  ' is required.');
            label.addClass('alert alert-danger pl-2')
        } else {
            label.text(label.attr('data_defaultTag'));
            label.removeClass('alert alert-danger pl-2')
            $(this).prev().prev().css('color', 'black');
        }
    });
    return isValid;
}
/***************************************************************
 * Uses an AJAX post request to sign up for the application
 **************************************************************/
function createAccount(element){

    if (validateForm(element) && $(element).val() != 'Cancel'){
        postForm($(element).closest('form').attr('id'), function(data, status){
            if (data.result != 'success'){
                $('#formMessage').text(data.message);
            } else {
                initializeSession(data);
            }
        });
    }
}

/**************************************************************
 * Signs out of the application and removes local session data
 **************************************************************/
function signOut(){
    sessionKey = ''
    localStorage.removeItem('sessionKey');
    clearInterval(intervalFunction);
    user = '';

    //Set everything to defaults
    $('#welcomeMessage').html('<i class="fas fa-user-circle"></i>');
    $('#headerLogo').toggleClass('col-12 col-md-8 col-sm-7 col-6');
    //Show navbar & signout options
    $('#jotNavBar').hide();
    $('#sidebarLeft').html('');

    getLoginScreen();
}

/**************************************************************
 * Initializes a local session. 
 **************************************************************/
function initializeSession(data){
    sessionKey = data.sessionKey;
    localStorage.setItem('sessionKey', JSON.stringify(sessionKey));
    user = data.user;

    //Display Welcome Message
    $('#welcomeMessage').html('<i class="fas fa-user-circle"></i> ' + user.fname + ' ' + user.lname);
    $('#headerLogo').toggleClass('col-12 col-md-8 col-sm-7 col-6');
    //Show navbar & signout options
    $('#jotNavBar').show();

    //Get new entry screen by default
    getNewEntryScreen();
    getFilteredJots();
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
    var jotID = data = $('#jotArea').attr('data_jot_id');
    console.log(jotID);
    $.get('/editJot', {key: sessionKey, jotID: jotID}, function(data, status){
        if (status == 'success'){
            clearInterval(intervalFunction);
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
            getFilteredJots();
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
 *  Returns a partial view displaying a list of recent Jots. 
 ****************************************************************/
function getFilteredJots(){
    var selection = $('#filterTags').children("option:selected").attr('data_tag_id');
    if (selection == null || selection == undefined){
        selection = 0;
    }
    $.get('/getFilteredJots', {key: sessionKey, selection : selection}, function(data){
        $('#sidebarLeft').html(data);
    }).fail(function(jqXHR) {
        console.log(jqXHR.status);
        //TODO - if 401 - redirect to login 
        //TODO - if 404 - display not found
        //TODO - if 400 - display error message 
    }); 

}
/****************************************************************
 * calls the displayJot method and passes in the ID of the specified jot
 ****************************************************************/
function getListJot(element){
    displayJot($(element).attr('data_jot_id'))
}

/****************************************************************
 * Creates a post request to store comment on server
 ****************************************************************/
function saveComment(element){
    var parent = $(element).closest(".commentCard");
    console.log(parent);
    console.log(parent.children('.commentBody').eq(0));
    console.log(parent.children('.commentBody').eq(0).children('.commentArea').eq(0));
    var comment = {};
    comment.text = parent.children('.commentBody').eq(0).children('.commentArea').eq(0).val();
    comment.id = parent.attr('data_comment_id');
    comment.jotID = $('#jotArea').attr('data_jot_id');
    console.log(comment);
    if (comment.text.length > 0){
        $.post('/saveComment', {key: sessionKey, comment: comment}, function(data, status){ 
            closeComment(element, data);
        }).fail(function(jqXHR) {
            console.log(jqXHR.status);
            //TODO - If 401 - redirect to login 
            //TODO - if 400 - display error message 
        });
    }   
}

/****************************************************************
 * This cancels the comment edits.
 ****************************************************************/
function closeComment(element, newComment){
    var parent = $(element).closest(".commentCard");
    var parentID = parent.attr('data_comment_id');
    if (parentID == '0'){
        parent.children('.commentBody').eq(0).children('.commentArea').eq(0).val('');
        if (newComment != null){            
            parent.before("<div data_comment_id='" + newComment.id + "' class='commentCard card mt-3'></div>");
            var display = parent.prev();
            var htmlString = "<div class='card-header p-0 d-flex flex-row'>";
            htmlString += "<h6 class='card-title m-0 text-center w-100 mt-2'> " + new Date(newComment.date).toDateString() + "</h6>";
            htmlString += "<button class='btn btn-outline-dark btnEditComment' onclick='editComment(this)'><i class='fas fa-edit'></i></button></div>";
            htmlString += "<div class='card-body p-2 pb-0 commentBody'><p>" + newComment.text + "</p></div";
            display.append(htmlString);
        }
    } else {
        parent.empty();
        parent.remove();
        $('.commentCard').each(function(){
            if ($(this).attr('data_comment_id') == parentID){
                if (newComment != null){
                    $(this).children('.commentBody').eq(0).children('p').eq(0).text(newComment.text);
                }
                $(this).show();
            }
        })
    }
}

/****************************************************************
 * This cancels the comment edits.
 ****************************************************************/
function editComment(element){
    var parent = $(element).closest(".commentCard");
    var text = parent.children('.commentBody').eq(0).children('p').eq(0).text();
    var id = parent.attr('data_comment_id');
    parent.hide();
    parent.before("<div data_comment_id='" + id + "' class='commentCard card mt-3'></div>");
    var editable = parent.prev();
    var htmlString = "<div class='card-header p-0 d-flex flex-row'><label class='card-title text-center h6 w-100 mt-2'>Edit Comment:</label></div>";
    htmlString += "<div class='commentBody card-body p-2 '><textarea class='commentArea w-100 h-100'>" + text + "</textarea></div>";
    htmlString += "<div id='saveDiv' class='row m-0 pb-2'><div class='col-2'></div>";
    htmlString += "<button class='btnAddComment col-3 mt-0 btn btn-outline-dark' onclick='saveComment(this)'>Save</button><div class='col-2'></div>";
    htmlString += "<button class='btnClrComment col-3 mt-0 btn btn-outline-dark' onclick='closeComment(this, null)'>Cancel</button><div class='col-2'></div></div>";
    editable.append(htmlString);
}