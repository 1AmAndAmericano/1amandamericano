exports.main = function(req, res){
    if (req.session.userid != undefined){
        var sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database('myDB.db');
        var email = req.session.userid;
        var filter = ' customer email: '+ email;
        var query = 'select * ' +
                    'from Reservations ' +
                    'left join Customers '+
                    'on Reservations.Email = Customers.Email '+
                    'where Customers.Email =\'' + email + '\'';
        console.log(query);
        db.all(query, function(err, row){
                        console.log(row);
                        res.render('list', {title: '1am Americano Hotel',name:'1am Americano', data : JSON.stringify(row)});
                        });
        db.close();
    }
    else {
	    res.render('main', { title: 'Sign in'});
    }
}


exports.make_resv = function(req, res) {
    res.render('resv', {title : 'Make Reservatioin'});
}
