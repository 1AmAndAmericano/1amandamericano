exports.main = function(req, res){
    if (req.session.userid != undefined){
	    res.render('Mana_resv', { title: 'Make Resv',name:'1am Americano', data:'', filter:''});

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
    filter += 'from: '+ from;
    filter += ' to: '+ to;
    filter += ' room type: '+ room_type + '';
    var query = make_query(from, to, room_type);
    console.log(query);
    db.all(query, function(err, row){
        res.render('Mana_resv', {title: 'Make Resv',name:'1am Americano', data : JSON.stringify(row) , filter : filter});
    });
    db.close();
    //res.render('Mana_resv', {title : 'Make Reservatioin'});
}

exports.insertdb = function(req, res){
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('myDB.db');
    var roomnumber = req.body.RoomNumber;
    var roomprice = req.body.RoomPrice;
    var roomtype = req.body.RoomType;
    var other_data = req.body.other_data;
    other_data = other_data.split('/');
    var data = req.body.data;
    console.log(roomnumber);
    console.log(roomprice);
    console.log(roomtype);
    console.log(other_data);
    console.log(data);
    var email = other_data[0];
    var bank = other_data[1];
    var account = other_data[2];
    var j = data_parse(data);
    var checkin = j[0];
    var checkout = j[1];
    var query ="";
    function getNum(callback){
        db.get('select max(resvid) from reservations;', function (err, row) {
            console.log(row);
            callback(row);
        });
    }

    function retval(ret){
        var query = "INSERT INTO reservations ('ResvID', 'Email', 'RoomNumber','CheckinDate', 'CheckoutDate', 'Is_Customer', 'ResvState', 'Price', 'Bank', 'Account') VALUES (";
        query+= String(Number(ret['max(resvid)'])+1)+", ";
        query+= '"'+email+'", ';
        query+= roomnumber+", ";
        query+= '"'+checkin+' 23:00:00", ';
        query+= '"'+checkout+' 10:00:00", ';
        query+= 0+", ";
        query+= 0+", ";
        query+= String(roomprice*(str2Date(checkout)-str2Date(checkin))/86400000)+", ";
        query+= '"'+bank+'", ';
        query+= account+")";
        console.log(query);
        db.run(query, function(err){
            console.log("db success");
        });
    }
    getNum(retval);
    res.redirect('/resv');
    db.close();
}


var make_query = function(from, to, room_type){
    var str= "select * from rooms where roomnumber not in (select rooms.roomnumber from Reservations left join rooms on Reservations.RoomNumber=Rooms.RoomNumber ";
    var q = 'where ';
    if ((from != undefined && from !='') && (to != undefined && to !='')) {
        q+="CheckinDate between '"+from+"' and '"+to+"' or "
        q+="CheckoutDate between '"+from+"' and '"+to+"' or "
        q+="CheckinDate <='"+from+"' and checkoutdate >='"+to+"')"
    }
    if (room_type != undefined) {
        q+="RoomType='"+room_type+"' order by roomnumber asc";
    }
    if(q.length == 6){
        return str;
    } else {
        str +=q;
        return str;
    }
}

var data_parse = function(raw_data){
    var list = raw_data.split(' ');
    return [list[1], list[3]];
}

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
