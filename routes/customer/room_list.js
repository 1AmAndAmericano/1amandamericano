exports.main = function(req, res){
    var name = '';
    if(req.session.userid != undefined)
        name = req.session.userid
    res.render('room_list', {title : '1am Americano Hotel',
                                    name : name});

}
