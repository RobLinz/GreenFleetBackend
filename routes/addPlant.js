var express = require('express');
var router = express.Router();
var sql = require('mysql');
var jwt = require('jsonwebtoken');
const JWTKEY = 'e3c72fbdffef434dbd5f3434fab42a9a';

router.post('/', function (req, res, next) {
    /* Make sure all necessary data has been included */
    if (!req.body || !req.body.plantName || !req.body.plantType || !req.body.monitor_id || !req.body.location || !req.body.userToken) {
        res.send({
            response: 'missing information',
        })
    }
    else {
        jwt.verify(req.body.userToken, JWTKEY, function (err, decodedToken) {
            if (err || !decodedToken.user_id) {
                res.send({
                    response: 'invalid token'
                });
            } else {
                const user_id = decodedToken.user_id;
                const con = sql.createConnection({
                    host: '13.58.189.112',
                    user: 'pi',
                    password: 'raspberry',
                    database: 'greenfleet'

                });

                con.connect(function (err) {
                    if (err) {
                        res.send({
                            response: 'couildn\'t connect to db',
                            error: err
                        });
                    } else {

                        con.query(`INSERT into plants (user_id, monitor_id, plantName, plantType, location) VALUES (${user_id}, ${con.escape(req.body.monitor_id)}, ${con.escape(req.body.plantName)}, ${con.escape(req.body.plantType)}, ${con.escape(req.body.location)})`, function (error, results, fields) {
                            if (error) {
                                con.end();
                                res.send({
                                    response: 'couildn\'t add plant to db',
                                    error: error,
                                });
                            }
                            else {
                                con.end();
                                res.send({
                                    response: 'plant added!',
                                    data: {
                                        plantName: req.body.plantName,
                                        plantType: req.body.plantType,
                                        monitor_id: req.body.monitor_id,
                                        location: req.body.location,
                                    }
                                });
                            }


                        });


                    }
                });
            }
        });
    }


});

module.exports = router;
