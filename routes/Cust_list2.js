exports.main = function(req, res){
    if (req.session.userid != undefined){
        console.log(req.session.userid); 
        var sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database('myDB.db');
        var email = req.session.userid;
        var filter = ' customer email: '+ email;
        var query = 'select * from Reservations left join rooms on Reservations.RoomNumber=Rooms.RoomNumber where Email =' + email;
        console.log(query);
        db.all(query, function(err, row){
                        res.render('Cust_list', {title: 'List complete',name:'1am Americano', data : JSON.stringify(row)});
                        });
        db.close();
    }
    else {
	    res.render('Cust_login', { title: 'Sign in'}); 
    }
}


exports.make_resv = function(req, res) {
    res.render('Cust_resv', {title : 'Make Reservatioin'});
}

