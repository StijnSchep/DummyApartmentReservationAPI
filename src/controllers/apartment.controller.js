const apartmentValidator = require("../business/apartment.validator");
const authController = require("../controllers/authentication.controller");
const logger = require("../config/appconfig").logger;
const database = require("../data/mssql.dao");
const sql = require("mssql");

// Get all apartments from the database
const getAllApartments = (req, res, next) => {
  logger.trace("connected with endpoint GET /api/apartments/");

  database.connect(next, () => {
    const ps = new sql.PreparedStatement();

    const query =
      "SELECT ( " +
      "SELECT a.ApartmentId, Description, StreetAddress, PostalCode, City, " +
      "(SELECT UserID, FirstName, LastName, StreetAddress, PostalCode, City, DateOfBirth, PhoneNumber, EmailAddress FROM DBUser u WHERE u.UserId = a.UserId FOR JSON PATH) AS Landlord, " +
      "(SELECT Firstname, LastName, StartDate, EndDate, Status FROM Reservation r JOIN DBUser u ON u.UserId = r.UserId WHERE r.ApartmentId = a.ApartmentId FOR JSON PATH) AS Reservations " +
      "FROM Apartment a FOR JSON PATH, ROOT('result') " +
      ") AS result";

    database.executeStatement(ps, query, {}, next, data => {
      sql.close();

      // Query returns a JSON string, retrieve this string
      const resultArray = data.recordset;
      const resultObject = resultArray[0];

      //Check if the string exists
      if (resultObject.result != null) {
        res.status(200).json(JSON.parse(resultObject.result));
      } else {
        res.status(200).json({
          result: []
        });
      }
    });
  });
};

// Get info for a single apartment
const getApartmentById = (req, res, next) => {
  logger.trace("connected with endpoint GET /api/apartments/:id");

  const apartmentID = req.params.apartmentID;

  database.connect(next, () => {
    const ps = new sql.PreparedStatement();
    ps.input("ApartmentID", sql.Int);

    const query =
      "SELECT ( " +
      "SELECT a.ApartmentId, Description, StreetAddress, PostalCode, City, " +
      "(SELECT UserID, FirstName, LastName, StreetAddress, PostalCode, City, DateOfBirth, PhoneNumber, EmailAddress FROM DBUser u WHERE u.UserId = a.UserId FOR JSON PATH) AS Landlord, " +
      "(SELECT ReservationId, Firstname, LastName, StartDate, EndDate, Status FROM Reservation r JOIN DBUser u ON u.UserId = r.UserId WHERE r.ApartmentId = a.ApartmentId FOR JSON PATH) AS Reservations " +
      "FROM Apartment a WHERE ApartmentId = @ApartmentID FOR JSON PATH, ROOT('result') " +
      ") AS result";

    database.executeStatement(
      ps,
      query,
      { ApartmentID: apartmentID },
      next,
      data => {
        sql.close();

        const resultArray = data.recordset;
        const resultObject = resultArray[0];

        if (resultObject.result != null) {
          res.status(200).json(JSON.parse(resultObject.result));
        } else {
          const errorObject = {
            message: "No apartment found with this ID",
            code: 404
          };

          next(errorObject);
        }
      }
    );
  });
};

const createApartment = (req, res, next) => {
  logger.trace("connected with endpoint POST /api/apartments/");
  const apartment = req.body;

  apartmentValidator.validate(apartment, err => {
    if (err) {
      logger.trace("Apartment validation failed");
      next(err);
    }

    if (!err) {
      apartment.UserId = req.userId;
      database.connect(next, () => {
        const ps = new sql.PreparedStatement();
        ps.input("Description", sql.NVarChar(255));
        ps.input("StreetAddress", sql.NVarChar(255));
        ps.input("PostalCode", sql.NVarChar(255));
        ps.input("City", sql.NVarChar(255));
        ps.input("UserId", sql.Int);

        const query =
          "INSERT INTO Apartment (Description, StreetAddress, PostalCode, City, UserId) " +
          "VALUES (@Description, @StreetAddress, @PostalCode, @City, @UserId) SELECT SCOPE_IDENTITY() AS ApartmentId";

        logger.debug(apartment);
        database.executeStatement(ps, query, apartment, next, data => {
          sql.close();

          res.status(200).json({
            message: "Apartment was succesfully saved",
            id: data.recordset[0].ApartmentId,
            code: 200
          });
        });
      });
    }
  });
};

const updateApartment = (req, res, next) => {
  logger.trace("connected with endpoint PUT /api/apartments/:id");

  const apartment = req.body;

  apartmentValidator.validate(apartment, err => {
    if (err) {
      logger.trace("Apartment validation failed");
      next(err);
    }

    if (!err) {
      const apartmentId = req.params.apartmentID;

      authController.checkApartmentOwnership(
        apartmentId,
        req.userId,
        next,
        result => {
          if (result) {
            // User is authorized to update apartment
            apartment.ApartmentId = apartmentId;
            apartment.UserId = req.userId;

            const ps = new sql.PreparedStatement();
            ps.input("Description", sql.NVarChar(255));
            ps.input("StreetAddress", sql.NVarChar(255));
            ps.input("PostalCode", sql.NVarChar(255));
            ps.input("City", sql.NVarChar(255));
            ps.input("ApartmentId", sql.Int);
            ps.input("UserId", sql.Int);

            const query =
              "UPDATE Apartment SET Description = @Description, StreetAddress = @StreetAddress, PostalCode = @PostalCode, City = @City " +
              "WHERE ApartmentId = @ApartmentId AND UserId = @UserId";

            logger.debug(apartment);
            database.executeStatement(ps, query, apartment, next, data => {
              sql.close();

              res.status(200).json({
                message: "Apartment data was succesfully updated",
                code: 200
              });
            });
          } else {
            // User is not authorized to update apartment
            const errorObject = {
              message: "You are not permitted to change this data",
              code: 401
            };

            next(errorObject);
          }
        }
      );
    }
  });
};

const deleteApartment = (req, res, next) => {
  logger.trace("connected with endpoint DELETE /api/apartments/:id");

  const apartmentId = req.params.apartmentID;

  authController.checkApartmentOwnership(
    apartmentId,
    req.userId,
    next,
    result => {
      if (result) {
        // User is authorized to delete apartment

        const ps = new sql.PreparedStatement();
        ps.input("ApartmentId", sql.Int);
        ps.input("UserId", sql.Int);

        const query =
          "DELETE FROM Apartment WHERE ApartmentId = @ApartmentId AND UserId = @UserId";

        database.executeStatement(
          ps,
          query,
          { ApartmentId: apartmentId, UserId: req.userId },
          next,
          data => {
            sql.close();

            res.status(200).json({
              message: "Apartment data was succesfully deleted",
              code: 200
            });
          }
        );
      } else {
        // User is not authorized to delete apartment
        const errorObject = {
          message: "You are not permitted to delete this data",
          code: 401
        };

        next(errorObject);
      }
    }
  );
};

module.exports.deleteApartment = deleteApartment;
module.exports.createApartment = createApartment;
module.exports.updateApartment = updateApartment;
module.exports.getAllApartments = getAllApartments;
module.exports.getApartmentById = getApartmentById;
