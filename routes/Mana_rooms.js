exports.main = function(req, res){
        res.render('Mana_rooms', { title : 'Rooms', data: null, from:'', to:'', filter: null});
}


exports.rooms_show = function(req, res) {
        console.log(req.body.from);
        console.log(req.body.to);
        console.log(req.body.room_type);
        var sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database('myDB.db');
        var from = req.body.from;
        var to = req.body.to;
        if (from == '' || to == ''){
            res.render('Mana_rooms', { title: 'Rooms', data:null, from:'', to:'', filter: 'You have to fix period' });
            }
        else{
        var room_type = req.body.room_type;
        var filter = 'room type: '+room_type;
        var query = make_query(from, to, room_type);
        console.log(query);
        db.all(query, function(err, row){
                        res.render('Mana_rooms', { title: 'Rooms', data : JSON.stringify(row) , from:from, to:to, filter :  filter});
                        });
        db.close();
        }
}


var make_query = function(from, to, room_type){
        var fromdate = from+' 00:00:00';
        var todate = to+' 00:00:00';
        var roomtype_filter="select * from rooms left join Reservations on Reservations.RoomNumber=Rooms.RoomNumber"; 
         if (room_type != undefined) {
        roomtype_filter = roomtype_filter+" where RoomType='"+room_type+"'";
        }
       
        var str = "select * from ("+roomtype_filter+") where ((checkindate is null) or (checkindate<='"+todate+"' and datetime(checkoutdate, '-1 days')>='"+fromdate+"'))";

        

        return str;
}

