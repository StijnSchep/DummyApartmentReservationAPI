const sql    = require('mssql');
const config = require('../config/appconfig').mssqlconfig;
const logger = require('../config/appconfig').logger;

module.exports = {
   connect: (next, callback) => {
       logger.trace('connecting to database')

       sql.connect(config, err => {

           if(err) {
             logger.trace('Error connecting');
             
               const errorObject = {
                    message: err.message,
                    code: 500
               }

               sql.close();
               next(errorObject);
           }

           if(!err) {
               callback();
           }
       })
   },

   executeStatement: (statement, query, params, next, callback) => {
       logger.trace('Executing statement');

        statement.prepare(query, err => {
            if(err) {
                logger.error(err.message);

                const errorObject = {
                    message: 'error creating query',
                    code: 500
                }

                sql.close();
                next(errorObject);
            }

            if(!err) {
                logger.trace('Statement has been prepared');
                statement.execute(params, (err, data) => {
                    if(err) {
                        logger.error(err.message);
                        
                        const errorObject = {
                            message: "Database error",
                            code: 500
                        }
        
                        sql.close();
                        next(errorObject);
                        return;
                    }

                    if(data) {
                        callback(data)
                    } else {
                        callback(null);
                    }

                    statement.unprepare((err) => {});
                });
            }
        })
   }
}


