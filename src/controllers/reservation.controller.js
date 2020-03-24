const reservationValidator = require("../business/reservation.validator");
const authController = require("../controllers/authentication.controller");
const logger = require("../config/appconfig").logger;
const database = require("../data/mssql.dao");
const sql = require("mssql");

const getAllReservations = (req, res, next) => {
  logger.trace("connected with endpoint GET /api/apartments/:id/reservations");

  database.connect(next, () => {
    const ps = new sql.PreparedStatement();
    ps.input("ApartmentId", sql.Int);

    const query = `
    BEGIN 
      IF EXISTS (SELECT * FROM Apartment WHERE ApartmentId = @ApartmentId)
      BEGIN
        SELECT ReservationId, FirstName, LastName, StartDate, EndDate, Status 
        FROM Reservation r JOIN DBUser u ON u.UserId = r.UserId WHERE ApartmentId = @ApartmentId
      END ELSE BEGIN
        SELECT 'invalid' AS Invalid END END`;

    database.executeStatement(
      ps,
      query,
      { ApartmentId: req.params.apartmentID },
      next,
      data => {
        sql.close();

        if (data && data.recordset && data.recordset[0]) {
          // Response was returned, either reservations exist or the apartment doesn't exist

          if (data.recordset[0].Invalid) {
            // response 'invalid' was given, apartment doesn't exist
            const errorObject = {
              message: "No apartment found for this ID",
              code: 404
            };

            next(errorObject);
          } else {
            res.status(200).json({
              result: data.recordset
            });
          }
        } else {
          // Apartment does exist, but no reservations were found
          const errorObject = {
            message: "No reservations found for this apartment",
            code: 404
          };

          next(errorObject);
        }
      }
    );
  });
};
module.exports.getAllReservations = getAllReservations;

const getReservationById = (req, res, next) => {
  logger.trace(
    "connected with endpoint GET /api/apartments/:id/reservations/:id"
  );

  database.connect(next, () => {
    const ps = new sql.PreparedStatement();
    ps.input("ApartmentId", sql.Int);
    ps.input("ReservationId", sql.Int);

    const query =
      "SELECT ReservationId, FirstName, LastName, StartDate, EndDate, Status " +
      "FROM Reservation r JOIN DBUser u ON u.UserId = r.UserId WHERE ApartmentId = @ApartmentId AND ReservationId = @ReservationId";

    const params = {
      ApartmentId: req.params.apartmentID,
      ReservationId: req.params.reservationID
    };

    database.executeStatement(ps, query, params, next, data => {
      sql.close();

      if (data.recordset[0]) {
        res.status(200).json({
          result: data.recordset
        });
      } else {
        const errorObject = {
          message: "No reservation found for this ID",
          code: 404
        };

        next(errorObject);
      }
    });
  });
};
module.exports.getReservationById = getReservationById;

const createReservation = (req, res, next) => {
  logger.trace("connected with endpoint POST /api/apartments/:id/reservations");
  const reservation = req.body;

  reservationValidator.validate(reservation, err => {
    if (err) {
      logger.trace("Reservation validation failed");
      next(err);
    }

    if (!err) {
      reservation.ApartmentId = req.params.apartmentID;
      reservation.UserId = req.userId;

      database.connect(next, () => {
        const ps = new sql.PreparedStatement();
        ps.input("ApartmentId", sql.Int);
        ps.input("UserId", sql.Int);
        ps.input("StartDate", sql.Date);
        ps.input("EndDate", sql.Date);

        const query =
          "BEGIN " +
          "IF EXISTS (SELECT * FROM Apartment WHERE ApartmentId = @ApartmentId) " +
          "BEGIN " +
          "INSERT INTO Reservation (ApartmentId, StartDate, EndDate, Status, UserId) " +
          "VALUES (@ApartmentId, @StartDate, @EndDate, 'INITIAL', @UserId); SELECT SCOPE_IDENTITY() AS ReservationId  " +
          "END " +
          "ELSE " +
          "BEGIN " +
          "SELECT 'false' AS Response " +
          "END " +
          "END ";

        database.executeStatement(ps, query, reservation, next, data => {
          sql.close();

          if (
            data &&
            data.recordset &&
            data.recordset[0] &&
            data.recordset[0].ReservationId
          ) {
            res.status(200).json({
              message: "Reservation was succesfully saved",
              id: data.recordset[0].ReservationId,
              code: 200
            });
          } else {
            const errorObject = {
              message: "No apartment found with this ID",
              code: 404
            };

            next(errorObject);
          }
        });
      });
    }
  });
};
module.exports.createReservation = createReservation;

const updateReservation = (req, res, next) => {
  logger.trace(
    "connected with endpoint PUT /api/apartments/:id/reservations/:id"
  );

  apartmentId = req.params.apartmentID;
  reservationId = req.params.reservationID;

  // check if the current user owns the apartment, placed the reservation or both
  authController.checkReservationPermissions(
    apartmentId,
    reservationId,
    req.userId,
    next,
    (owns, placed) => {
      if (!owns && !placed) {
        const errorObject = {
          message: "No permission to change this data",
          code: 401
        };

        next(errorObject);
      }

      // current user both owns the apartment and placed the reservation
      // user can edit startdate, enddate AND status
      if (owns && placed) {
        logger.info("User has permission to alter dates and status");

        // Figure out if the user wants to change the status as the owner, the dates, or both
        if (req.body.Status) {
          reservationValidator.validateStatus(req.body.Status, err => {
            if (err) {
              logger.trace("Status validation failed");
              next(err);
              return;
            }

            // User wants to edit status, check if user also wants to change dates
            if (req.body.StartDate || req.body.EndDate) {
              reservationValidator.validate(req.body, err => {
                if (err) {
                  logger.trace("Reservation validation failed");
                  next(err);
                  return;
                }
                logger.trace("User wants to change dates and status");

                const ps = new sql.PreparedStatement();
                ps.input("StartDate", sql.Date);
                ps.input("EndDate", sql.Date);
                ps.input("Status", sql.VarChar(10));
                ps.input("ReservationId", sql.Int);
                ps.input("UserId", sql.Int);

                const query =
                  "UPDATE Reservation SET StartDate = @StartDate, EndDate = @EndDate, Status = @Status WHERE ReservationId = @ReservationId AND UserId = @UserId";
                const params = {
                  Status: req.body.Status,
                  ReservationId: reservationId,
                  UserId: req.userId
                };

                database.executeStatement(ps, query, params, next, data => {
                  sql.close();
                  res.status(200).json({
                    message: "Succesfully updated reservation data",
                    code: 200
                  });
                });
              });
            } else {
              logger.trace("User wants to change status");
              const ps = new sql.PreparedStatement();
              ps.input("Status", sql.VarChar(10));
              ps.input("ReservationId", sql.Int);

              const query =
                "UPDATE Reservation SET Status = @Status WHERE ReservationId = @ReservationId";
              const params = {
                Status: req.body.Status,
                ReservationId: reservationId
              };

              database.executeStatement(ps, query, params, next, data => {
                sql.close();
                res.status(200).json({
                  message: "Succesfully updated reservation status",
                  code: 200
                });
              });
            }
          });
        } else {
          // User wants to change dates
          reservationValidator.validate(req.body, err => {
            if (err) {
              logger.trace("Reservation validation failed");
              next(err);
              return;
            }

            logger.trace("User wants to change dates");
            const ps = new sql.PreparedStatement();
            ps.input("StartDate", sql.Date);
            ps.input("EndDate", sql.Date);
            ps.input("UserId", sql.Int);
            ps.input("ReservationId", sql.Int);

            const query =
              "UPDATE Reservation SET StartDate = @StartDate, EndDate = @EndDate WHERE ReservationId = @ReservationId AND UserId = @UserId";
            const params = {
              StartDate: req.body.StartDate,
              EndDate: req.body.EndDate,
              ReservationId: reservationId,
              UserId: req.userId
            };

            database.executeStatement(ps, query, params, next, data => {
              sql.close();
              res.status(200).json({
                message: "Succesfully updated reservation dates",
                code: 200
              });
            });
          });
        }
      }

      // current user owns the apartment
      // user can edit the status
      else if (owns) {
        logger.info("User has permission to alter status");

        if (req.body.StartDate || req.body.EndDate) {
          const errorObject = {
            message: "You can only change reservation status",
            code: 401
          };

          next(errorObject);
          return;
        }

        reservationValidator.validateStatus(req.body.Status, err => {
          if (err) {
            logger.trace("Status validation failed");
            next(err);
            return;
          }

          // User has permission and body has the right parameters

          const ps = new sql.PreparedStatement();
          ps.input("Status", sql.VarChar(10));
          ps.input("ReservationId", sql.Int);

          const query =
            "UPDATE Reservation SET Status = @Status WHERE ReservationId = @ReservationId";
          const params = {
            Status: req.body.Status,
            ReservationId: reservationId
          };

          database.executeStatement(ps, query, params, next, data => {
            sql.close();
            res.status(200).json({
              message: "Succesfully updated reservation status",
              code: 200
            });
          });
        });
      } else if (placed) {
        logger.info("User has permission to alter dates");

        if (req.body.Status) {
          const errorObject = {
            message:
              "You have no permission to change the status of this reservation",
            code: 401
          };

          next(errorObject);
          return;
        }

        reservationValidator.validate(req.body, err => {
          if (err) {
            logger.trace("Reservation validation failed");
            next(err);
            return;
          }

          logger.trace("User has permission and body has the right parameters");
          const ps = new sql.PreparedStatement();
          ps.input("StartDate", sql.Date);
          ps.input("EndDate", sql.Date);
          ps.input("ReservationId", sql.Int);
          ps.input("UserId", sql.Int);

          const query =
            "UPDATE Reservation SET StartDate = @StartDate, EndDate = @EndDate, Status = 'INITIAL' WHERE ReservationId = @ReservationId and UserId = @UserId";
          const params = {
            StartDate: req.body.StartDate,
            EndDate: req.body.EndDate,
            ReservationId: reservationId,
            UserId: req.userId
          };

          database.executeStatement(ps, query, params, next, data => {
            sql.close();
            res.status(200).json({
              message: "Succesfully updated reservation dates",
              code: 200
            });
          });
        });
      }
    }
  );
};
module.exports.updateReservation = updateReservation;

const deleteReservation = (req, res, next) => {
  logger.trace(
    "connected with endpoint DELETE /api/apartments/:id/reservations/:id"
  );

  reservationId = req.params.reservationID;

  database.connect(next, () => {
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
        if (!data.recordset[0]) {
          // No apartment exists with this id, so no reservations either
          const errorObject = {
            message: "No reservation found to delete",
            code: 404
          };

          next(errorObject);
        } else if (data.recordset[0].UserId === req.userId) {
          // user is authorized to delete data

          const ps = new sql.PreparedStatement();
          ps.input("ReservationId", sql.Int);
          ps.input("UserId", sql.Int);

          const query =
            "DELETE FROM Reservation WHERE ReservationId = @ReservationId AND UserId = @UserId";

          database.executeStatement(
            ps,
            query,
            { ReservationId: reservationId, UserId: req.userId },
            next,
            data => {
              sql.close();

              res.status(200).json({
                message: "Reservation was succesfully deleted",
                code: 200
              });
            }
          );
        } else {
          // user is not authorized to delete data
          const errorObject = {
            message: "You have no permission to delete this reservation",
            code: 401
          };

          next(errorObject);
        }
      }
    );
  });
};
module.exports.deleteReservation = deleteReservation;
