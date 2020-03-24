const assert = require("assert");
const logger = require("../config/appconfig").logger;

module.exports = {
  validate: (reservation, callback) => {
    // Check if start date is valid, try to correct if needed (string to date)
    if (reservation.StartDate) {
      if (typeof reservation.StartDate === "string") {
        reservation.StartDate = new Date(reservation.StartDate);

        if (isNaN(reservation.StartDate.getTime())) {
          // Date is not valid, meaning that format was invalid or date does not exist

          const errorObject = {
            message: "Invalid start date, format should be YYYY-MM-DD",
            code: 400
          };

          callback(errorObject);
          return;
        }
      }

      if (!(reservation.StartDate instanceof Date)) {
        // Given object is not a valid date

        const errorObject = {
          message: "Invalid start date",
          code: 400
        };

        callback(errorObject);
        return;
      } else {
        if (isNaN(reservation.StartDate)) {
          const errorObject = {
            message: "Start date does not exist",
            code: 400
          };

          callback(errorObject);
          return;
        }
      }
    } else {
      const errorObject = {
        message: "Missing start date",
        code: 400
      };

      callback(errorObject);
      return;
    }

    // Check if end date is valid, try to correct if needed (string to date)
    if (reservation.EndDate) {
      if (typeof reservation.EndDate === "string") {
        reservation.EndDate = new Date(reservation.EndDate);
        if (isNaN(reservation.EndDate.getTime())) {
          // Date is not valid, meaning that format was invalid or date does not exist

          const errorObject = {
            message: "Invalid end date, format should be YYYY-MM-DD",
            code: 400
          };

          callback(errorObject);
          return;
        }
      }

      if (!(reservation.EndDate instanceof Date)) {
        // Given object is not a valid date

        const errorObject = {
          message: "Invalid end date",
          code: 400
        };

        callback(errorObject);
        return;
      } else {
        if (isNaN(reservation.EndDate)) {
          const errorObject = {
            message: "End date does not exist",
            code: 400
          };

          callback(errorObject);
          return;
        }
      }
    } else {
      const errorObject = {
        message: "Missing end date",
        code: 400
      };

      callback(errorObject);
      return;
    }

    // Check if date values are possible
    const currentDate = new Date();
    if (reservation.StartDate < currentDate) {
      const errorObject = {
        message: "Start date cannot be in the past",
        code: 400
      };

      callback(errorObject);
      return;
    }

    if (reservation.EndDate < reservation.StartDate) {
      const errorObject = {
        message: "End date cannot be earlier than start date",
        code: 400
      };

      callback(errorObject);
      return;
    }

    callback(null);
  },

  validateStatus: (status, callback) => {
    if (!status) {
      const errorObject = {
        message: "Reservation status missing",
        code: 400
      };

      callback(errorObject);
      return;
    }

    if (typeof status !== "string") {
      const errorObject = {
        message: "Invalid reservation status",
        code: 400
      };

      callback(errorObject);
      return;
    }

    if (
      status !== "INITIAL" &&
      status !== "ACCEPTED" &&
      status !== "NOT_ACCEPTED" &&
      status !== "NOT-ACCEPTED" &&
      status !== "REJECTED"
    ) {
      const errorObject = {
        message:
          "Reservation status can only be changed to ACCEPTED or NOT_ACCEPTED",
        code: 400
      };

      callback(errorObject);
      return;
    }

    callback(null);
  }
};
