exports.main = function(req, res){
    console.log("customer clicks login.");
    res.render('login', {title : '1am Americano Hotel'});
};

exports.login = function(req, res){
   
        console.log("customer tries login.");

        var sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database('myDB.db');
        var userid = req.body.userid;
        var pwd = req.body.pwd;
        var query = 'select email, password from Customers where email=\''+userid+'\' and password=\''+pwd+'\'';
        var row_email;
        db.get(query, function(err, row){
            if(row != undefined){
                if (userid == row.Email && pwd ==row.Password ){
                    console.log("customer login success");
                    req.session.userid = row.Email;
                    res.render('main', { title : '1am Americano Hotel',
                                    name : userid,
                                    filter : '',
                                    data: null });
                }
                else {
                    console.log("login fail!!");
                    res.redirect('/');
                }
             }
             else {
                res.redirect('login');
             }
        });
        db.close();
}


exports.logout = function(req, res) {
    
    console.log("customer logout.");
    
    req.session.destroy(function(err) {
        res.redirect('/');
    });
}
exports.signup = function(req, res){
	console.log("signup");
    res.render('signup', {title : '1amAmericano Hotel', name : "", tryid:false});
}
exports.make_account = function (req, res){
    var email = req.body.useremail;
    var password = req.body.password;
    var name = req.body.username;
	var sqlite3 = require('sqlite3').verbose();
	var db = new sqlite3.Database('myDB.db');
    var q = "insert into customers ('Email', 'Name', 'Password') Values(";
    q +="'"+email+"', ";
    q +="'"+name+"', ";
    q +="'"+password+"')";
    console.log(q);
    db.run( q, function(err, row){
       console.log("make account success"); 
    });
    res.redirect('/');
}

exports.check_email = function(req, res){
	console.log("check email");
	var sqlite3 = require('sqlite3').verbose();
	var db = new sqlite3.Database('myDB.db');
	var userid = req.body.userid;
	var query = "select count(*) from Customers where email='"+userid+"'";
	console.log(query);
	db.get(query, function(err, row){
		if (row['count(*)'] >0){
			res.render('signup', {title :'1amAmericano Hotel',name: '', tryid:true});
		}else{
			res.render('signup', {title :'1amAmericano Hotel', name : userid, tryid:true});
		}
	});
	db.close();
}
exports.findpwd = function(req, res){
	res.render('findpwd', { title: 'Customer find pwd',name:'1am Americano'});
}
