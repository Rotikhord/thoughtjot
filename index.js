// JavaScript source code
// variable preparation
var express = require('express');
var bcrypt = require('bcrypt');
var app = express();
var port = process.env.PORT || 5000;

// static directory
app.use(express.static('public'));

// VIEW
//app.set('views', 'view-access');
app.set('view engine', 'ejs');

// CONTROL
app.get('/rate', returnRate);
app.get('/math_service', returnJSON);
//app.get('/', function (req, res) { res.sendFile('views/pages/home.html', { root: __dirname }) });

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
