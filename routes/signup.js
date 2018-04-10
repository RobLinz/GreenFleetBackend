var express = require('express');
var router = express.Router();
var sql = require('mysql');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
const JWTKEY = 'e3c72fbdffef434dbd5f3434fab42a9a';

//todo ask about webtoken creation here

router.post('/', function(req, res, next) {
    /* Make sure all necessary data has been included */
    if(!req.body || !req.body.username || !req.body.password || !req.body.email || !req.body.firstname || !req.body.lastname || !req.body.hasOwnProperty('pets') || !req.body.hasOwnProperty('kids') ){
        res.send({
            response: 'missing information'
        })
    }
    else{
        const con = sql.createConnection({
            host    : '13.58.189.112',
            user    : 'pi',
            password: 'raspberry',
            database: 'greenfleet'

        });

        con.connect(function (err) {
            if(err){
                res.send({
                    response: 'couildn\'t connect to db',
                    error: err
                });
            }else{
                con.query(`SELECT * FROM users WHERE username=${con.escape(req.body.username)}`, function(error, results, fields) {
                    if(error) {
                        con.end();
                        res.send({
                            response: 'couildn\'t query db',
                            error: error
                        });
                    }
                    else if (results.length > 0){
                        con.end();
                        res.send({
                            response: 'Sorry! That username has already been taken.'
                        })
                    }
                    else {
                        const SALT = crypto.randomBytes(64).toString('base64'); /* node crypto lib generates 64 random bytes */
                        let hash = crypto.createHash('sha256');
                        hash.update(`${SALT}${req.body.password}`);
                        let salted_password = hash.digest('hex');

                        con.query(`INSERT INTO users (username, firstname, lastname, email, passwordHash, passwordSalt, hasPets, hasKids) 
                                VALUES (${con.escape(req.body.username)}, ${con.escape(req.body.firstname)}, ${con.escape(req.body.lastname)}, ${con.escape(req.body.email)}, "${salted_password}", "${SALT}", ${req.body.pets}, ${req.body.kids} )`, function(error, results, fields) {
                            console.log(JSON.stringify(results));
                            if(error) {
                                con.end();
                                res.send({
                                    response: 'couildn\'t add user to db',
                                    error: error
                                });
                            }
                            else {


                                con.end();
                                res.send({
                                    response: 'user added!',
                                    token: jwt,
                                    data: {
                                        isRegistered: true,
                                        username: req.body.username,
                                        firstname: req.body.firstname,
                                        lastname: req.body.lastname,
                                        email: req.body.email,
                                        pets: req.body.kids,
                                        kids: req.body.pets,
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
