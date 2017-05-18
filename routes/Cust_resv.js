exports.main = function(req, res){
	console.log("customer's current reservation list");
		var userid = req.session.userid
    res.render('Cust_resv', { title : 'Current Reservation',
                                name : userid,
                                filter : 'You have to fix period',
                                from2 :'',
                                to2 :'',
                                data: null });
};


/*exports.rooms_search = function(req, res) {
        console.log("consumer is searching room.");
        var sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database('myDB.db');
        var from = req.body.from;
        var to = req.body.to;
        var guests = req.body.guests;
        if (from == '' || to == ''){
            res.render('Cust_main', { title: 'Main',
                                        name:'1am Americano',
                                        filter: 'You have to fix period',
                                        from2 : '',
                                        to2 : '',
                                        data: null });
            }
        else{
                var filter = 'from: '+ from + ' to : ' + to;
                var query = search_room_query(from, to);
                console.log(query);
                db.all(query, function(err, row){
                                res.render('Cust_main', { title: 'Main',
                                                            name:'1am Americano',
                                                            filter: filter,
                                                            from2 : from,
                                                            to2 : to,
                                                            data : JSON.stringify(row) });
                                });
        }
        db.close();
}*/

/*var search_room_query = function(from, to){
        var fromdate = from+' 00:00:00';
        var todate = to+' 00:00:00';*/

        /* Search reservation for which period overlaps with period from FROM to TO.*/
        /*var resv_query="(select DISTINCT RoomNumber " +
                "from Reservations " +
                " where (" + fromdate + "<checkoutDate and checkoutDate <= " + todate + ") or " +
                " where (" + fromdate + "<checkinDate and checkinDate <= " + todate + ") or " +
                " where (checkinDate<=" +fromdate + " and " + todate + " <= checkoutDate))";

        /*Search rooms available*/
        /*var room_query = "select RoomType, COUNT(DISTINCT RoomType) as count" +
                         "from Rooms" +
                         "left join Reservations " +
                         "on Rooms.RoomNumber = Reservations.RoomNumber" +
                         "where Rooms.RoomNumber not exists in " + resv_query +
                         "order by RoomType";

         return room_query;
}*/
exports.resv_list = function(req, res) {
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('myDB.db');
    //var from = req.body.from;
    var email = req.body.cust_email;
    //var to = req.body.to;
    //var room_type = req.body.room_type;
    //var occupied = (req.body.occupied=='Occupied') ? 3 : undefined;
    var filter = ' customer email: '+ email;
    //filter += ' from: '+ from;
    //filter += ' to: '+ to;
    //filter += ' room type: '+ room_type;
    //filter += ' occupied: '+ req.body.occupied;
	var query = "select * from Reservations where Reservations.Email=email"
	console.log(query);
	db.all(query, function(err, row){
				console.log(row);
        res.render('Cust_resv', {title: 'List complete', name:email, data : JSON.stringify(row) , filter :  filter});
    });
    db.close();
}

var make_query = function(email){
    var str='select * from Reservations left join rooms on Reservations.Email=Customers.Email ';
    var q = 'where ';
		return str;
    /*if (email != undefined && email !='') {
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
	if(q.length == 2){
		return str;
	} else {
    	str +=q;
    	return str.substring(0,str.length-5);
	}*/
}
