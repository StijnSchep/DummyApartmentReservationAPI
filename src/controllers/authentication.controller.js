const tokenGenerator = require("../business/token.generator");
const userValidator = require("../business/user.validator");
const logger = require("../config/appconfig").logger;
const database = require("../data/mssql.dao");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sql = require("mssql");

module.exports = {
  register: (req, res, next) => {
    logger.trace("registering a user");

    const user = req.body;

    userValidator.validate(user, err => {
      if (err) {
        next(err);
      }

      if (!err) {
        // User information is valid

        const query = `
                    BEGIN
                        IF NOT EXISTS (SELECT EmailAddress FROM DBUser WHERE EmailAddress = @EmailAddress)
                    BEGIN
                        INSERT INTO DBUser (FirstName, LastName, StreetAddress, PostalCode, City, DateOfBirth, PhoneNumber, EmailAddress, Password) 
                        VALUES (@FirstName, @LastName, @StreetAddress, @PostalCode, @City, @DateOfBirth, @PhoneNumber, @EmailAddress, @Password); SELECT SCOPE_IDENTITY() AS UserId
                    END
                    ELSE
                    BEGIN
                        SELECT 'invalid' AS Invalid
                    END
                    END`;

        database.connect(next, () => {
          const ps = new sql.PreparedStatement();
          ps.input("FirstName", sql.NVarChar(50));
          ps.input("LastName", sql.NVarChar(50));
          ps.input("StreetAddress", sql.NVarChar(255));
          ps.input("PostalCode", sql.NVarChar(50));
          ps.input("City", sql.NVarChar(2550));
          ps.input("DateOfBirth", sql.Date);
          ps.input("PhoneNumber", sql.NVarChar(50));
          ps.input("EmailAddress", sql.NVarChar(255));
          ps.input("Password", sql.NVarChar(255));

          bcrypt.hash(user.Password, 10, (err, hash) => {
            if (err) {
              const errorObject = {
                message: "Error hashing user password",
                code: 500
              };

              next(errorObject);
            }

            if (hash) {
              user.Password = hash;

              database.executeStatement(ps, query, user, next, data => {
                if (data.recordset[0].UserId) {
                  tokenGenerator.generateToken(
                    data.recordset[0].UserId,
                    token => {
                      res.status(200).json({
                        result: {
                          token: token
                        }
                      });
                    }
                  );
                } else if (data.recordset[0].Invalid) {
                  const errorObject = {
                    message: "Email address already exists in the database",
                    code: 400
                  };

                  next(errorObject);
                }

                sql.close();
              });
            }
          });
        });
      }
    });
  },

  login: (req, res, next) => {
    logger.trace("user is logging in");

    const user = req.body;
    if (!user.EmailAddress || !user.Password) {
      const errorObject = {
        message: "Incorrect Email Address or Password",
        code: 401
      };

      next(errorObject);
    }

    const query =
      "SELECT UserId, Password FROM DBUser WHERE EmailAddress = @EmailAddress";

    database.connect(next, () => {
      const ps = new sql.PreparedStatement();
      ps.input("EmailAddress", sql.NVarChar(255));

      database.executeStatement(
        ps,
        query,
        { EmailAddress: user.EmailAddress },
        next,
        data => {
          sql.close();

          if (data.recordset.length === 0) {
            const errorObject = {
              message: "Incorrect Email Address or Password",
              code: 401
            };

            next(errorObject);
          } else {
            logger.trace("validating password");

            bcrypt.compare(
              user.Password,
              data.recordset[0].Password,
              (err, result) => {
                if (err) {
                  logger.error(err.message);

                  const errorObject = {
                    message: "Database error",
                    code: 500
                  };

                  next(errorObject);
                }

                if (result) {
                  logger.trace("UserId:", data.recordset.UserId);

                  // Password is correct
                  tokenGenerator.generateToken(
                    data.recordset[0].UserId,
                    token => {
                      logger.trace("Sending token to user");
                      res.status(200).json({ token: token });
                    }
                  );
                } else {
                  // Password is incorrect
                  const errorObject = {
                    message: "Incorrect Email Address or Password",
                    code: 401
                  };

                  next(errorObject);
                }
              }
            );
          }
        }
      );
    });
  },

  validateToken: (req, res, next) => {
    logger.trace("Validating token");

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      errorObject = {
        message: "Authorization token missing!",
        code: 401
      };

      next(errorObject);
      return;
    }

    const token = authHeader.substring(7, authHeader.length);
    logger.debug("token:", token);
    const key = process.env.JWTKEY || "secretkey";

    jwt.verify(token, key, (err, payload) => {
      if (err) {
        errorObject = {
          message: "Error validating token",
          code: 401
        };
        next(errorObject);
      }

      logger.debug("Payload:", payload);

      if (payload && payload.UserId) {
        logger.info("Token is valid");
        req.userId = payload.UserId;
        next();
      } else {
        errorObject = {
          message: "No UserId found",
          code: 401
        };

        next(errorObject);
      }
    });
  },

  checkApartmentOwnership: (apartmentId, userId, next, callback) => {
    database.connect(next, () => {
      const ps = new sql.PreparedStatement();
      ps.input("ApartmentId", sql.Int);

      const query =
        "SELECT UserId FROM Apartment WHERE ApartmentId = @ApartmentId";

      database.executeStatement(
        ps,
        query,
        { ApartmentId: apartmentId },
        next,
        data => {
          if (!data.recordset[0]) {
            const errorObject = {
              message: "No apartment found with this ID",
              code: 404
            };

            next(errorObject);
            return;
          }

          if (data.recordset[0].UserId === userId) {
            // Current user has ownership over this apartment
            callback(true);
          } else {
            // Current user has no ownership over this apartment
            callback(false);
          }
        }
      );
    });
  },

  // For editting reservations, check if the user owns the apartment, the reservation or both
  checkReservationPermissions: (
    apartmentId,
    reservationId,
    userId,
    next,
    callback
  ) => {
    let hasOwnership = false;
    let placedReservation = false;

    module.exports.checkApartmentOwnership(
      apartmentId,
      userId,
      next,
      result => {
        if (result) {
          hasOwnership = true;
        }

        const ps = new sql.PreparedStatement();
        ps.input("ReservationId", sql.Int);

        const query =
          "SELECT UserId FROM Reservation WHERE ReservationId = @ReservationId";

        database.executeStatement(
          ps,
          query,
          { ReservationId: reservationId },
          next,
          data => {
            logger.debug(data);

            if (!data.recordset[0]) {
              const errorObject = {
                message: "No reservation found for this ID",
                code: 404
              };

              next(errorObject);
              return;
            }

            if (data.recordset[0].UserId === userId) {
              // current user placed the reservation

              placedReservation = true;
            }

            callback(hasOwnership, placedReservation);
          }
        );
      }
    );
  }
};
