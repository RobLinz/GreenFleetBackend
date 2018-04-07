var express = require('express');
var router = express.Router();
var sql = require('mysql');
var jwt = require('jsonwebtoken');
const JWTKEY = 'e3c72fbdffef434dbd5f3434fab42a9a';

router.post('/', function (req, res, next) {
    /* Make sure all necessary data has been included */
    if (!req.body || !req.body.userToken || !req.body.plant_id) {
        console.log(req.body.plant_id);
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
                        con.query(`DELETE FROM plants WHERE plant_id=${req.body.plant_id}`, function (error, results, fields) {
                            if (error) {
                                con.end();
                                res.send({
                                    response: 'couildn\'t query plants for plant_id',
                                    error: error
                                });
                            }
                            else {
                                con.end();
                                res.send({
                                    response: 'Plants has been deleted. Rest in Pieces little plant buddy',
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