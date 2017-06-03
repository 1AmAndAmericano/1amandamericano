exports.main = function(req, res){
    if (req.session.userid != undefined){
	    res.render('Mana_list', { title: 'Reservation List',name:'1am Americano', userid: req.session.userid, data: undefined, filter: undefined});

    }
    else {
	    res.render('Mana_login', { title: 'Sign in'}); 
    }
}


exports.list_show = function(req, res) {
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('myDB.db');
    var from = req.body.from;
    var email = req.body.cust_email;
    var to = req.body.to;
    var room_type = req.body.room_type;
    var occupied = (req.body.occupied=='Occupied') ? 3 : undefined;
    var filter = ' customer email: '+ email;
    filter += ' from: '+ from;
    filter += ' to: '+ to;
    filter += ' room type: '+ room_type;
    filter += ' occupied: '+ req.body.occupied;
	var query = make_query(email,from, to, room_type, occupied); 
	console.log(query);
    if (req.session.userid == undefined){
    console.log('heyhey');
    }
	db.all(query, function(err, row){
        res.render('Mana_list', {title: 'Reservation List',name:'1am Americano', userid: req.session.userid, data : JSON.stringify(row) , filter :  filter});
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
        res.redirect('/list_show');
}


exports.checkin = function(req, res){
        var sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database('myDB.db');
        var resvid = req.body.ResvID;

        db.run('update reservations set ResvState=2 where ResvID="'+resvid+'"', function (err, row) {
                        console.error(err);
                        });
        res.redirect('/list_show');
}



var make_query = function(email,from, to, room_type, occupied){
        var str='select * from Reservations left join rooms on Reservations.RoomNumber=Rooms.RoomNumber ';
        var q = 'where ';
        if (email != undefined && email !='') {
                q+="Email='"+email+"' and ";
        }
        if (from != undefined && from !='') {
                q+="CheckinDate >= '"+from+"' and ";
        }
        if (to != undefined && to !='') {
                q+="CheckoutDate <= '"+to+"' and ";
        }
        if (room_type != undefined) {
                q+="RoomType='"+room_type+"' and ";
        }
        if (occupied != undefined) {
                q+="ResvState="+occupied+" and ";
        }
        if(q.length == 6){
                return str;
        } else {
                str +=q;
                return str.substring(0,str.length-4);
        }
}
