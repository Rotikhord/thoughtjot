// JavaScript source code
// variable preparation
const express = require('express');
const session =  require('express-session');
const bcrypt = require('bcrypt');
const uuid = require('uuid/v4');
const app = express();
var port = process.env.PORT || 5000;

// static directory
app.use(express.static('public'));

// VIEW
//app.set('views', 'view-access');
app.set('view engine', 'ejs');

// CONTROL
app.get('/test', function(req, res) {
  res.render('pages/index');
});
app.get('/rate', returnRate);
app.get('/math_service', returnJSON);
//app.get('/', function (req, res) { res.sendFile('views/pages/home.html', { root: __dirname }) });

//Use a random integer as the salt for security purposes. 
app.use(session({
  name: 'id',
  secret: uuid(),
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000
}));

app.get('/', function(req, res){
  console.log(req.sessionID);
   if(req.session.page_views){
      req.session.page_views++;
      res.send("You visited this page " + req.session.page_views + " times\nUnique ID = " +  uuid());
   } else {
      req.session.page_views = 1;
      res.send("Welcome to this page for the first time!");
   }
});

// Have Control listening on PORT()
app.listen(port, function () {
  console.log(`The server is listening on PORT ${port} and will run here as well.`)
});

// MODEL
function calculate(request) {
  console.log('request received = ' + request.url);
  // prepare variables
  var operation = request.query.operations;
  var fNum = Number(request.query.firstNum);
  var sNum = Number(request.query.secondNum);
  var answer = 0;

  // handle the operation
  if (operation == 'Add') {
    console.log('request received = add');
    answer = fNum + sNum;
  }
  if (operation == 'Subtract') {
    console.log('request received = subtract');
    answer = fNum - sNum;
  }
  if (operation == 'Multiply') {
    console.log('request received = multiply');
    answer = fNum * sNum;
  }
  if (operation == 'Divide') {
    console.log('request received = divide');
    answer = fNum / sNum;
  }

  // prepare the parameters to be sent to the calculation-results.ejs
  var params = { operation: operation, fNum: fNum, sNum: sNum, answer: answer };

  return params;
}

function calculateRate(request) {

}

function returnRate(request, response) {
  response.write("This is a test");
  response.end();
}

function returnJSON(request, response) {
 // var params = JSON.stringify(calculate(request));
  console.log('request JSON');
  // 
  response.writeHead(200, { "Content-Type": "application/json" });
  response.write(params);
  response.end();
}
