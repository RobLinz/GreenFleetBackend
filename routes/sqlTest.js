var express = require('express');
var router = express.Router();
var sql = require('mysql');

var con = sql.createConnection({
    host    : 'http://ec2-13-58-189-112.us-east-2.compute.amazonaws.com',
    user    : 'pi',
    password: 'raspberry',
    database: 'greenfleet'

});

//change get to post
router.get('/', function(req, res, next) {
    console.log("a");
    con.connect(function (err) {
        if(err){
            res.send('Oops! Couldn\'t connect to DB ' + JSON.stringify(err));
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
