exports.resv_list = function(req, res) {
    if(req.session.userid == undefined){
        res.redirect('/login');
        return;
    }
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('myDB.db');
    var email = req.session.userid;
    var query = 'select r.ResvID as ResvID, r.Email as Email, r.RoomNumber as RoomNumber, r.CheckinDate as CheckinDate, r.CheckoutDate as CheckoutDate, r.Price as Price, Rooms.RoomType as RoomType  from Reservations r, Customers, Rooms where r.Email = Customers.Email and Rooms.RoomNumber = r.RoomNumber and r.Email =\''+email+'\'';
    console.log("customer, resv_list query : " + query);
	db.all(query, function(err, row){
                    console.log("customer, resv_list query row : " + row);
                    res.render('resv', {title: '1am Americano Hotel', name:email, is_history : 0, data : JSON.stringify(row) });
    });
    db.close();
}


exports.resv_history_list = function(req, res) {
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('myDB.db');
    var email = req.session.userid;
    var query = 'select r.ResvID as ResvID, r.Email as Email, r.RoomNumber as RoomNumber, r.CheckinDate as CheckinDate, r.CheckoutDate as CheckoutDate, r.Price as Price, Rooms.RoomType as RoomType  from Reservations_History r, Customers, Rooms where r.Email = Customers.Email and Rooms.RoomNumber = r.RoomNumber and r.Email =\''+email+'\'';
    console.log("customer, resv_list query : " + query);
	db.all(query, function(err, row){
                    console.log("customer, resv_list query row : " + row);
                    res.render('resv', {title: '1am Americano Hotel', name:email, is_history : 1, data : JSON.stringify(row) });
    });
    db.close();
}

exports.cancelresv = function(req, res){
        var sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database('myDB.db');
        var resvid = req.body.ResvID;

        db.run('DELETE FROM reservations where ResvID="'+resvid+'"', function (err, row) {
                        console.error(err);
                        });
        db.run('UPDATE Reservations_History SET ResvState = 4 where ResvID="'+resvid+'"', function (err, row) {
                        console.error(err);
                        });
        res.redirect('/resv_list');
}
