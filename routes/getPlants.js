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
                        con.query(`SELECT * FROM plants JOIN types ON plants.plantType = types.common_name WHERE plants.user_id=${user_id}`, function (error, results, fields) {
                            if (error) {
                                con.end();
                                res.send({
                                    response: 'couildn\'t query plants for user_id',
                                    error: error
                                });
                            }
                            else {
                                //console.log(JSON.stringify(results));
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
                                let fleetTypes = results.map(result => {
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
                                let fleetTypesNames = fleetTypes.map(item => item.common_name);
                                fleetTypes = fleetTypes.filter((item, i) => i === fleetTypesNames.indexOf(item.common_name));

                                con.end();
                                res.send({
                                    response: 'Plants obtained and listed!',
                                    plantData,
                                    fleetTypes,
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