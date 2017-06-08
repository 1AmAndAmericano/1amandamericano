/* Get information from main, use information in confirm_resv. */

/* Fill reservation info. */
exports.main = function(req, res){
        console.log("customer is booking reservation.");
        if(req.session.userid == undefined){
                res.redirect('/');
        } else {
                var userid = req.session.userid;
                var roomtype = req.body.roomtype;
                var filter = req.body.filter;
                var roomnumber = req.body.roomnumber;
                console.log(filter);
                console.log("room "+roomtype);
                console.log("room number "+roomnumber);
                var str = filter.split(" ");
                var from = str[1];
                var to = str[4];
                console.log("from : " + from);
                console.log("to : " + to);
                res.render('mk_resv', {title : '1am Americano Hotel',
                                        name : userid,
                                        roomtype : roomtype,
                                        roomnumber : roomnumber,
                                        to : to,
                                        from : from});
        }
}

exports.confirm_resv = function(req, res){
	var userid = req.session.userid;
	var to = req.body.to;
	var from = req.body.from;
	var roomtype = req.body.roomtype;
	var roomnumber = req.body.roomnumber;
	var bank = req.body.bank;
    console.log("bank  "+ bank);
	var account = req.body.account;
    var depositor = req.body.depositor;
    insert_resv(from, to, userid, roomtype, roomnumber, bank, account, depositor);
    res.render('dbsucess', {});
}


/**********************BELOW:_HELPER_FUNCTION***************************/


function str2Date(hey){
    var year = hey.substr(0, 4);
    var month = hey.substr(5, 2);
    var day = hey.substr(8, 2);
    month = Number(month) - 1;
    if (month == 12){
        month = 0;
    }
    return new Date(year, month, day);
}



var insert_resv = function(from, to, userid, roomtype, roomnumber, bank, account, depositor){
		var sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database('myDB.db');
 		console.log("insert resv from : " + from);
 		console.log("insert resv to : " + to);
 		console.log("insert resv userid : " + userid);
 		console.log("insert resv roomtype : " + roomtype);
 		console.log("insert resv roomnumber : " + roomnumber);
 		console.log("insert resv bank : " + bank);
 		console.log("insert resv account : " + account);
 		console.log("insert resv depositor : " + depositor);
        function getNum(callback){
       	db.get('select max(resvid) from Reservations_History;', function (err, row) {
            console.log(row);
            callback(row);
        	});
    	}
	    function retval(ret){
            var resv_q = "reservations ";
            var resv_history_q = "reservations_history "
            var query_head = "INSERT INTO "
		    var roomprice = 10;
        
            var query =  "('ResvID', 'Email', 'RoomNumber','CheckinDate', 'CheckoutDate', 'Is_Customer', 'ResvState', 'Price', 'Bank', 'Account', 'Depositor') " + 
                    "VALUES (";
            query+= String(Number(ret['max(resvid)'])+1) + ", ";
            query+= '"'+ userid +'", ';
            query+= roomnumber +  ", ";
            query+= '"'+ from +' 23:00:00", ';
            query+= '"'+ to +' 10:00:00", ';
            query+= 1 +", ";
            query+= 0+", ";
            query+= String(roomprice*(str2Date(to)-str2Date(from))/86400000)+", ";
            query+= '"'+bank+'", ';
            query+= account+',';
            query+= '"'+depositor+'")';
        
            resv_q = query_head + resv_q + query;
            resv_history_q = query_head + resv_history_q + query;
		    console.log("customer inesrt resv : " + resv_q);
		    console.log(resv_history_q);
            db.run(resv_q , function(){
                console.log("db update success reservations");
            });
            
            db.run(resv_history_q , function(){
                console.log("db update success reservation history");
            });
            

        }   
        getNum(retval);
	    db.close();
}
