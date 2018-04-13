var express = require('express');
var router = express.Router();
var sql = require('mysql');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
const JWTKEY = 'e3c72fbdffef434dbd5f3434fab42a9a';

router.post('/', function (req, res, next) {
    /* Make sure all necessary data has been included */
    if (!req.body || !req.body.username || !req.body.password) {
        res.send({
            response: 'missing information'
        })
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
                console.log("connected");
                con.query(`SELECT * FROM users WHERE username=${con.escape(req.body.username)}`, function (error, results, fields) {
                    if (error) {
                        con.end();
                        res.send({
                            response: 'couildn\'t query db for username',
                            error: error
                        });
                    }
                    else if (results.length < 1) {
                        con.end();
                        res.send({
                            response: 'password or username is incorrect'
                        })
                    }
                    else {
                        console.log(results[0]);
                        /*
                        *  Username was found
                        *  use salt to hash password user input
                        */
                        const SALT = results[0].passwordSalt; /* node crypto lib generates 64 random bytes */
                        let hash = crypto.createHash('sha256');
                        hash.update(`${SALT}${req.body.password.value}`);
                        let hashed_password = hash.digest('hex');

                        if(hashed_password !== results[0].passwordHash){
                            con.end();
                            res.send({
                                response: 'password or username is incorrect'
                            })
                        }
                        else{
                            const userData = {
                                isLoggedIn: true,
                                username: results[0].username,
                                firstname: results[0].firstname,
                                lastname: results[0].lastname,
                                email: results[0].email,
                                pets: results[0].hasPets,
                                kids: results[0].hasKids,
                            };

                            let token = jwt.sign({user_id: results[0].user_id}, JWTKEY);
                            con.end();
                            res.send({
                                response: 'Logged In!',
                                token,
                                userData,
                            });

                        }
                    }

                });
            }
        });
    }


});

module.exports = router;
