var express = require('express')
var router = express.Router();
const saltRounds = 8;
var moment = require('moment');
var bcrypt = require('bcrypt');


router.get('/', function(req, res, next) {
    res.send('Hello');
});



//////////////////////////////////////////////////////////////////////////
//Login User
//////////////////////////////////////////////////////////////////////////
router.get('/login', function(req, res, next) {
        var email = req.query.email;
        var password = req.query.password;
        //var hashed = bcrypt.hash(req.query.password, saltRounds);

        if (email != null) {
            req.getConnection(function(error, conn) {
                conn.query('SELECT id, name, address, email, phone_number, password FROM user WHERE email=? ', [email], function(err, rows, fields) {
                    if (err) {
                        res.status(500);
                        res.send(JSON.stringify({ success: false, message: err.message }));
                    } else {
                        if (rows.length > 0) {
                            let passwordIsValid = bcrypt.compareSync(password, rows[0].password);
                            if (!passwordIsValid) {
                                res.send(JSON.stringify({ success: false, message: 'wrong password'}));
                            }else{
                                res.send(JSON.stringify({ success: true, result: rows[0] }));
                            }
                        } else {
                            res.send(JSON.stringify({ success: false, message: 'User does not exist' }));
                        }
                    }
                });
            });
        } else {
            res.send(JSON.stringify({ success: false, message: 'Empty email' }));
        }
});






////////////////////////////////////////////////////////////////
///Register User
////////////////////////////////////////////////////////////////
router.post('/register', function(req, res, next) {

        var email = req.body.email;
        var name = req.body.name;
        var phone_number = req.body.password;
        var address = req.body.address;
        var password = req.body.password;

        if (email && name && password && phone_number != null) {
            req.getConnection(function(error, conn) {
                bcrypt.hash(password, saltRounds, function(err, hash){
                    conn.query('INSERT INTO user (name,address,password,email,phone_number) VALUES(?,?,?,?,?)', [name, address, hash, email, phone_number], function(err, rows, fields) {
                        if (err) {
                            res.status(500);
                            res.send({ success: false, message: err.message });
                        } else {
                            if (rows.affectedRows > 0) {
                                res.send({ success: true, message: 'Your registration is done' });
                            } else {
                                res.send({ success: false, message: 'Error registering your data' });
                            }
                        }
                    });
                });
            });
        } else {
            res.send(JSON.stringify({ success: false, message: 'Empty field(s)' }));
        }
});







////////////////////////////////////////////////////////////////
///Sumbit Order
////////////////////////////////////////////////////////////////
router.post('/order', function(req, res, next) {
    if (req.body.key == API_KEY) {

        var email = req.body.email;
        var name = req.body.name;
        var phone_number = req.body.password;
        var address = req.body.address;
        var password = req.body.password;

        if (email && name && password && phone_number != null) {
            req.getConnection(function(error, conn) {
                bcrypt.hash(password, saltRounds, function(err, hash){
                    conn.query('INSERT INTO order (name,address,password,email,phone_number) VALUES(?,?,?,?,?)', [name, address, hash, email, phone_number], function(err, rows, fields) {
                        if (err) {
                            res.status(500);
                            res.send({ success: false, message: err.message });
                        } else {
                            if (rows.affectedRows > 0) {
                                res.send({ success: true, message: 'Your registration is done' });
                            } else {
                                res.send({ success: false, message: 'Error registering your data' });
                            }
                        }
                    });
                });
            });
        } else {
            res.send(JSON.stringify({ success: false, message: 'Empty field(s)' }));
        }

    } else {
        res.send(JSON.stringify({ success: false, message: 'Invalid api key' }));
    }
});






//////////////////////////////////////////////////////////////////////////
//get price
//////////////////////////////////////////////////////////////////////////
router.get('/getPrice', function(req, res, next) {
    
    var type = req.query.type;
    var item = req.query.item;

    if (type || item !=  null) {

        req.getConnection(function(error, conn) {
            conn.query('SELECT type, item, amount FROM laundry_price WHERE type=? AND item=?', [type, item], function(err, rows, fields) {
                if (err) {
                    res.status(500);
                    res.send(JSON.stringify({ success: false, message: err.message }));
                } else {
                    if (rows.length > 0) {
                            res.send(JSON.stringify({ success: true, result: rows[0] }));
                    } else {
                        res.send(JSON.stringify({ success: false, message: 'Cannot fetch order now' }));
                    }
                }
            });
        });
    } else {
        res.send(JSON.stringify({ success: false, message: 'Empty fill in all the fields' }));
    }    

});







////////////////////////////////////////////////////////////////
///Update Price
////////////////////////////////////////////////////////////////
router.put('/updateLaundryPrice', function(req, res, next) {
    var type = req.body.type;
    var item = req.body.item;
    var amount = req.body.amount;

    if (type && item != null) {
        req.getConnection((err, conn) => {
            conn.query("Update `laundry_price` SET amount=? where type = ? and item = ?", [amount, type, item], (error, result) => {
                if (error) {
                    res.status(500);
                    res.send(JSON.stringify({ success: false, message: err.message }));
                }else{
                    if (result.affectedRows > 0) {
                        res.send(JSON.stringify({ success: true, message: `Price updated` }));
                    } else {
                        res.send(JSON.stringify({ success: false, message: 'Error entering your price, try again' }));
                    }
                }
            });
        });
    } else {
        res.send(JSON.stringify({ success: false, message: 'Enter a price' }));
    }

});



module.exports = router