/* Customer main page */
exports.main = function(req, res){
	
    console.log("customer main starts.");
    
    var name = '';
    if(req.session.userid != undefined)
        name = req.session.userid;
    res.render('main', { title : '1am Americano Hotel',
                               name : name,
                               filter : '',
                                data: null });
};

/*Customer selects period to find available room. */
exports.rooms_search = function(req, res) {
        
        console.log("customer is searching room.");
        
        var sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database('myDB.db');
        var name = '';
       
        if(req.session.userid != undefined)
            name = req.session.userid;
        
        var from = req.body.from;
        var to = req.body.to;
        var guests = req.body.guests;
        
        if ((from != undefined && from !='') && (to != undefined && to !='')) {
        
                var filter = 'from: '+ from + ' to : ' + to;
                var query = available_room_query(from, to);
                console.log(query);
                db.all(query, function(err, row){
                                console.log(row);
                                res.render('main', { title: '1am Americano Hotel',
                                                name : name,
                                                filter: filter,
                                                data : JSON.stringify(row) });
                                });
        } else {
            res.redirect('/');
        }
        db.close();
}

/*make query to find available room type from FROM to TO. */
var available_room_query = function(from, to){
    var str= "select RoomType, min(roomnumber) as num " + 
                "from rooms " + 
                "where roomnumber not in " + 
                    "(select rooms.roomnumber " + 
                        "from Reservations " + 
                        "left join rooms " + 
                        "on Reservations.RoomNumber=Rooms.RoomNumber ";
    var q = 'where ';
        q+="(CheckinDate between '"+from+"' and '"+to+"') or "
        q+="(CheckoutDate between '"+from+"' and '"+to+"') or "
        q+="(CheckinDate <='"+from+"' and checkoutdate >='"+to+"'))"
        q+="group by roomtype"
        str +=q;
        return str;
}
