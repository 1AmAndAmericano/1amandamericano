console.log("Hello, World!");

var express = require('express');
var cust_main = require("./routes/customer/main");
var cust_login = require("./routes/customer/login");
var cust_list = require("./routes/customer/list");
var cust_resv = require("./routes/customer/resv");
var cust_mk_resv = require("./routes/customer/mk_resv");
var cust_room_list = require("./routes/customer/room_list");


var mana_main = require("./routes/Mana_main");
var mana_list = require("./routes/Mana_list");
var mana_rooms = require("./routes/Mana_rooms");
var mana_mkresv = require("./routes/Mana_mkresv");

var customer_app = express();
var manager_app = express();

var session = require('express-session');
var SQLiteStore = require('connect-sqlite3')(session);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

customer_app.use(cookieParser());
manager_app.use(cookieParser());
customer_app.use(express.static('public'));

customer_app.use(bodyParser.urlencoded({extended : false}));
manager_app.use(bodyParser());

/**********CUSTOMER************/
customer_app.set('views', __dirname + '/views/customer');
customer_app.set('view engine', 'ejs');
customer_app.engine('html', require('ejs').renderFile);
customer_app.use(express.static(__dirname + '/public'));
customer_app.use(session({
    store: new SQLiteStore,
    secret: '#@1am@Americano@#Secret',
    resave: false,
    saveUninitialized: true
    }));

var customer_server = customer_app.listen(3000, function(){
    console.log("Express server has started on port 3000")
});

customer_app.get('/', cust_main.main);
customer_app.get('/login', cust_login.main);
customer_app.post('/login_try', cust_login.login);
customer_app.get('/logout', cust_login.logout);
customer_app.get('/rooms_list', cust_room_list.main);
customer_app.get('/resv_list', cust_resv.resv_list);
customer_app.post('/rooms_search', cust_main.rooms_search);
customer_app.post('/mk_resv', cust_mk_resv.main);
customer_app.post('/confirm_resv', cust_mk_resv.confirm_resv);
customer_app.get('/resv_history_list', cust_resv.resv_history_list);
customer_app.post('/cancelresv', cust_resv.cancelresv);
customer_app.get('/signup', cust_login.signup);
customer_app.post('/check_email', cust_login.check_email);
customer_app.post('/make_account', cust_login.make_account);
customer_app.get('/findpwd', cust_login.findpwd);

/**********MANAGER************/
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


var manager_server = manager_app.listen(3001, function(){
    console.log("Express server has started on port 3001")
});

manager_app.get('/', mana_main.main);
manager_app.get('/login', mana_main.main);
manager_app.get('/logout', mana_main.logout);
manager_app.post('/login', mana_main.login);
manager_app.get('/list', mana_list.main);
manager_app.post('/list_show', mana_list.list_show);
manager_app.get('/list_show', mana_list.list_show);
manager_app.get('/rooms', mana_rooms.main);
//manager_app.get('/rooms_show', mana_rooms.rooms_show);
manager_app.post('/rooms_show', mana_rooms.rooms_show);
manager_app.get('/resv', mana_mkresv.main);
manager_app.post('/make_resv', mana_mkresv.make_resv);
manager_app.post('/insertdb', mana_mkresv.insertdb);
manager_app.post('/cancelresv', mana_list.cancelresv);
manager_app.post('/checkin', mana_list.checkin);
