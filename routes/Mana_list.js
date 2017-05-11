exports.main = function(req, res){
    if (req.session.userid != undefined){
	    res.render('Mana_list', { title: 'List',name:'1am Americano', data:'', filter:''});

    }
    else {
	    res.render('Mana_login', { title: 'Sign in'}); 
    }
}


exports.make_resv = function(req, res) {
    console.log(req.body.from);
    console.log(req.body.to);
    console.log(req.body.room_type);
    console.log(req.body.guests);
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('myDB.db');
    var from = req.body.from;
    var to = req.body.to;
    var room_type = req.body.room_type;
    var filter = '';
    filter += '{ from: '+ from;
    filter += ' to: '+ to;
    filter += ' room type: '+ room_type+"}";

    var query = make_query2(from, to, room_type);
    console.log(query);
    db.all(query, function(err, row){
        res.render('Mana_resv', {title: 'make_resv',name:'1am Americano', data : JSON.stringify(row) , filter :  filter});
    });
    db.close();
    //res.render('Mana_resv', {title : 'Make Reservatioin'});
}

exports.list_show = function(req, res) {
    console.log(req.body.from); 
    console.log(req.body.cust_email); 
    console.log(req.body.to); 
    console.log(req.body.room_type); 
    console.log(req.body.occupied); 
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
	db.all(query, function(err, row){
        res.render('Mana_list', {title: 'List complete',name:'1am Americano', data : JSON.stringify(row) , filter :  filter});
    });
    db.close();
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

var make_query2 = function(from, to, room_type){
    var str='select RoomNumber, RoomType, RoomPrice from Reservations left join rooms on Reservations.RoomNumber=Rooms.RoomNumber ';
    var q = 'where ';
    if (from != undefined && from !='') {
        q+="CheckinDate < '"+from+"' and ";
    }
    if (to != undefined && to !='') {
        q+="CheckoutDate > '"+to+"' and ";
    }
    if (room_type != undefined) {
        q+="RoomType='"+room_type+"' and ";
    }
    if(q.length == 6){
        return str;
    } else {
        str +=q;
        return str.substring(0,str.length-4);
    }
}