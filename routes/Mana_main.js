exports.main = function(req, res){
    if (req.session.userid != undefined){
	    res.render('Mana_main', { title: 'Express',name:'1am Americano'});
    }
    else {
	    res.render('Mana_login', { title: 'Sign in'}); 
    }
}



exports.login = function(req, res){
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('myDB.db');
    var userid = req.body.userid;
    var pwd = req.body.pwd;
    var query = 'select email, password from Managers where email=\''+userid+'\' and password=\''+pwd+'\'';
    var row_email;
    db.get(query, function(err, row){
        if(row != undefined) {
            if (userid == row.Email && pwd == row.Password) {
                req.session.userid = row.Email;
                console.log("login success!!");
            }
            else {
                console.log("login fail!!");
            }
        }else{

        }
          res.redirect('/');
   });
   db.close();
}


exports.logout = function(req, res) {
    req.session.destroy(function(err) {
        res.redirect('/');
    });
}
