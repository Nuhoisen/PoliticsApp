// Node requires
var express     = require('express');
var app         = express();

var cors = require('cors');
var bodyParser  = require("body-parser");
var mysql       = require('mysql');

// Local rsequires
var poly_data	= require('./poly_data/poly_data.js');
var bill_data	= require('./bill_data/bill_data.js');
var SQL_Handler = require('./sql_handler/sql_handler.js').SQL_Handler

// ----------------------------------------------
// -------- Setup the SQL Databases -------------
global.poly_db = new SQL_Handler("PoliticianInfo");
global.poly_db.connect()

global.news_db = new SQL_Handler("newsarticlesdb");
global.news_db.connect()
// ----------------------------------------------

app.set('port',  8080);
app.use(bodyParser.urlencoded({extended: true} ));
app.use(bodyParser.json());

app.use(cors());


app.get('/', function (req, res) {
  res.send('hello world')
})

// --------------POLITICIAN REQUESTS -------------------
app.get('/request_state_partisanships', poly_data.request_state_partisanship);

app.get('/request_us_senator_partisanships', poly_data.request_us_senator_partisanships);

app.get('/request_state_politician_profile', poly_data.request_state_politician_profile);
// -----------------------------------------------------

// ----------------- BILL REQUESTS ---------------------
app.get('/request_candidates_bills', bill_data.request_candidates_bills);

// -----------------------------------------------------
app.listen(8080);