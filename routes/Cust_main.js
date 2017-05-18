exports.main = function(req, res){
	console.log("consumer main starts.");
    res.render('Cust_main', { title : 'Main',
																logincheck : 0,
                                name :'1am Americano',
                                filter : 'You have to fix period',
                                from2 :'',
                                to2 :'',
                                data: null });
};

/*exports.login_main = function(req,res){
	var userid = req.body.userid;
	res.render('Cust_main_login', { title : 'Main',
															logincheck : 0,
															name : JSON.stringify(userid),
															filter : 'You have to fix period',
															from2 :'',
															to2 :'',
															data: null });
	console.log(JSON.stringify(userid));
}*/

exports.rooms_search = function(req, res) {
        console.log("consumer is searching room.");
        var sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database('myDB.db');
        var from = req.body.from;
        var to = req.body.to;
        var guests = req.body.guests;
        if (from == '' || to == ''){
            res.render('Cust_main_login', { title: 'Main',
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
                                res.render('Cust_main_login', { title: 'Main',
                                                            name:'1am Americano',
                                                            filter: filter,
                                                            from2 : from,
                                                            to2 : to,
                                                            data : JSON.stringify(row) });
                                });
        }
        db.close();
}

var search_room_query = function(from, to){
        var fromdate = from+' 00:00:00';
        var todate = to+' 00:00:00';

        /* Search reservation for which period overlaps with period from FROM to TO.*/
        var resv_query="(select DISTINCT RoomNumber " +
                "from Reservations " +
                " where (" + fromdate + "<checkoutDate and checkoutDate <= " + todate + ") or " +
                " where (" + fromdate + "<checkinDate and checkinDate <= " + todate + ") or " +
                " where (checkinDate<=" +fromdate + " and " + todate + " <= checkoutDate))";

        /*Search rooms available*/
        var room_query = "select RoomType, COUNT(DISTINCT RoomType) as count" +
                         "from Rooms" +
                         "left join Reservations " +
                         "on Rooms.RoomNumber = Reservations.RoomNumber" +
                         "where Rooms.RoomNumber not exists in " + resv_query +
                         "order by RoomType";

         return room_query;
}

exports.logout = function(req, res) {
    req.session.destroy(function(err) {
        res.redirect('/');
    });
}
