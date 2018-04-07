var express = require('express');
var router = express.Router();
var sql = require('mysql');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
const JWTKEY = 'e3c72fbdffef434dbd5f3434fab42a9a';

router.post('/', function (req, res, next) {
    /* Make sure all necessary data has been included */
    if (!req.body || !req.body.userToken) {
        res.send({
            response: 'missing information v'
        })
    }
    else {
        jwt.verify(req.body.userToken, JWTKEY, function (err, decodedToken) {
            if (err || !decodedToken.user_id) {
                res.send({
                    response: 'invalid token'
                });
            }
            else {
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
                        con.query(`SELECT * FROM plants WHERE user_id=${user_id}`, function (error, results, fields) {
                            console.log(JSON.stringify(results));
                            if (error) {
                                con.end();
                                res.send({
                                    response: 'couildn\'t query plants for user_id',
                                    error: error
                                });
                            }
                            else {
                                console.log(JSON.stringify(results));
                                const plantData = results.map(result => {
                                    return {
                                        plantName: result.plantName,
                                        plantType: result.plantType,
                                        dateCreated: result.dateCreated,
                                        monitor_id: result.monitor_id,
                                        location: result.location,
                                        plant_id: result.plant_id,
                                    }
                                });
                                con.end();
                                res.send({
                                    response: 'Plants obtained and listed!',
                                    plantData,
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