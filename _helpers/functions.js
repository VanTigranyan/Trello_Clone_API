const jwt = require('jsonwebtoken');
const config = require('../config.json');

const createToken = (params) => {
    return new Promise( ( resolve, reject ) => {
        jwt.sign(params, config.secret, {expiresIn: '7 days'}, (err, token) => {
            if(err || !token) {
                reject(err)
            } else {
                resolve(token)
            }
        })
    })
}