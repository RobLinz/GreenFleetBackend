var express = require('express');
var router = express.Router();
var sql = require('mysql');
var jwt = require('jsonwebtoken');
const JWTKEY = 'e3c72fbdffef434dbd5f3434fab42a9a';

router.post('/', function (req, res, next) {
    /* FOR: displaying plant climate preferences in plant modal */
    if (!req.body || !req.body.userToken || !req.body.plantType) {
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
                        const common_name = req.body.plantType;
                        console.log(common_name);
                        con.query(`SELECT * FROM types WHERE common_name=${con.escape(common_name)}`, function (error, results, fields) {
                            if (error) {
                                con.end();
                                res.send({
                                    response: 'couildn\'t query types for type data',
                                    error: error
                                });
                            }
                            else {
                                const typePrefData = results.map(result => {
                                    return {
                                        common_name: result.common_name,
                                        scientific_name: result.scientific_name,
                                        origin: result.origin,
                                        pet_safe: result.pet_safe,
                                        temp_low: result.temp_low,
                                        temp_high: result.temp_high,
                                        light_pref: result.light_pref,
                                        watering_pref: result.watering_pref,
                                        soil_pref: result.soil_pref,
                                        grooming: result.grooming,
                                        humidity_pref: result.humidity_pref,
                                    }
                                });
                                if(typePrefData.length >0){
                                    con.end();
                                    res.send({
                                        response: 'Plant Type preferences obtained!',
                                        typePrefData: typePrefData[0],
                                    });
                                }


                            }
                        });
                    }
                });

            }
        });
    }
});

module.exports = router;