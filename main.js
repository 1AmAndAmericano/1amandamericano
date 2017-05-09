console.log("Hello, World!");
var express = require('express');
var cust_main = require("./routes/Cust_main");
var cust_list = require("./routes/Cust_list");
var mana_main = require("./routes/Mana_main");
var mana_list = require("./routes/Mana_list");

var customer_app = express();
var manager_app = express();

var session = require('express-session');
var SQLiteStore = require('connect-sqlite3')(session);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

customer_app.use(cookieParser());
manager_app.use(cookieParser());

customer_app.use(bodyParser());
manager_app.use(bodyParser());


customer_app.set('views', __dirname + '/views');
customer_app.set('view engine', 'ejs');
customer_app.engine('html', require('ejs').renderFile);

manager_app.set('views', __dirname + '/views');
manager_app.set('view engine', 'ejs');
manager_app.engine('html', require('ejs').renderFile);
manager_app.use(express.static(__dirname + '/public'));
manager_app.use(session({
    store: new SQLiteStore,
    secret: '#@1am@Americano@#Secret',
    resave: false,
    saveUninitialized: true
    }));

var customer_server = customer_app.listen(3000, function(){
    console.log("Express server has started on port 3000")
});

customer_app.get('/', cust_main.main);
customer_app.get('/list', cust_list.main);

var manager_server = manager_app.listen(3001, function(){
    console.log("Express server has started on port 3001")
});

manager_app.get('/', mana_main.main);
manager_app.get('/login', mana_main.main);
manager_app.get('/logout', mana_main.logout);
manager_app.post('/login', mana_main.login);
manager_app.get('/list', mana_list.main);
manager_app.post('/list_show', mana_list.list_show);
