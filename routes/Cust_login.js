exports.main = function(req, res){
	res.render('Cust_login', { title: 'Express',name:'1am Americano'});
};

exports.login = function(req, res){
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('myDB.db');
    var userid = req.body.userid;
    var pwd = req.body.pwd;
    var query = 'select email, password from Customers where email=\''+userid+'\' and password=\''+pwd+'\'';
    var row_email;
    db.get(query, function(err, row){
        if (userid == row.Email && pwd ==row.Password ){
            req.session.userid = row.Email;
						/*req.session.check = 1;
						res.render('Cust_main', {title : 'Main',
																				logincheck : req.session.check,
				                                name :req.session.userid,
				                                filter : 'You have to fix period',
				                                from2 :'',
				                                to2 :'',
				                                data: null });*/
            console.log("login success!!");
						res.render('Cust_main_login', { title : 'Main',
																				logincheck : 0,
																				name : userid,
																				filter : 'You have to fix period',
																				from2 :'',
																				to2 :'',
																				data: null });
        }
        else {
            console.log("login fail!!");
						res.redirect('/');
        }
    });
    db.close();
}


exports.logout = function(req, res) {
    req.session.destroy(function(err) {
        res.redirect('/');
    });
}
