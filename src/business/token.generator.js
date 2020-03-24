const jwt = require('jsonwebtoken');
const logger = require('../config/appconfig').logger;

module.exports = {
    generateToken: (userId, callback) => {
        logger.trace('Generating token');
        logger.debug(userId);

        const key = process.env.JWTKEY || 'secretkey';

        const payload = {
            UserId: userId
        }

        jwt.sign(payload, key, { expiresIn: 60 * 60 * 2 }, (err, token) => {
            if(err) {
                logger.error(err.message);

                const errorObject = {
                    message: 'Error generating token',
                    code: 500
                }
                next(errorObject)
            }


            if(token) {
                logger.trace('Token received:', token);
                callback(token);
            } else {
                const errorObject = {
                    message: 'Error generating token',
                    code: 500
                }
                next(errorObject)
            }
        })
    }
    
}