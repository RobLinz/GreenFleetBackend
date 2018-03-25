var express = require('express');
var router = express.Router();
var sql = require('mysql');

//change get to post
router.get('/', function(req, res, next) {
    console.log("a");
    const con = sql.createConnection({
        host    : '13.58.189.112',
        user    : 'pi',
        password: 'raspberry',
        database: 'greenfleet'

    });
    con.connect(function (err) {
        if(err){
            res.send('Oops!!! Couldn\'t connect to DB ' + JSON.stringify(err));
        }else{
            con.query('SELECT * FROM moisture', function(error, results, fields) {
                if(error) {
                    con.end();
                    res.send('error');
                }
                else {
                    con.end();
                    res.send('results' + JSON.stringify(results)); /* usually a js object */
                }

            });
        }
    });
});

module.exports = router;
