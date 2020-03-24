const express    = require('express');
const bodyParser = require('body-parser');
const app        = express();
const sql        = require('mssql');
const logger     = require('./appconfig').logger;

const apartmentRoute   = require('../routes/apartment.route');
const registerRoute    = require('../routes/register.route'); 
const loginRoute       = require('../routes/login.route');

app.all('*', (req, res, next) => {
    logger.trace('attempt to connect with an API endpoint');

    next();
})

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api/appartments', apartmentRoute);
app.use('/api/apartments', apartmentRoute);

app.use('/api/register', registerRoute);
app.use('/api/login', loginRoute)

app.use('*', (req, res, next) => {
    logger.trace('failed attempt: no endpoint was found');
    const errorObject = {
      message: 'Endpoint not found',
      code: 404
    }
  
    next(errorObject);
})

// Error handler
app.use((error, req, res, next) => {
    sql.close();
    logger.error("error handler: " + error.message);
    res.status(error.code).json(error);
});
  
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`App listening on port ${PORT}`))
  
module.exports = app;