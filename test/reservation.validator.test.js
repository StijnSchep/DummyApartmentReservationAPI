const assert = require("assert");
const validator = require("../src/business/reservation.validator");

// Set start date 10 days in the future
const startDate = new Date();
startDate.setDate(startDate.getDate() + 10);

// Set end date 15 days in the future
const endDate = new Date();
endDate.setDate(endDate.getDate() + 15);

let reservation = {
  StartDate: startDate,
  EndDate: endDate
};

beforeEach("Setting up reservation object", () => {
  // Make reservation values valid again
  reservation = {
    StartDate: startDate,
    EndDate: endDate
  };
});

// Test if validator handles missing data
describe("Reservation validator omitted data test", () => {
  it("should accept a reservation with all data included", done => {
    validator.validate(reservation, err => {
      assert(!err, "No error should be thrown when all data is included");
      done();
    });
  });

  it("should not accept a reservation with missing start date", done => {
    reservation.StartDate = null;
    validator.validate(reservation, err => {
      assert(err, "Error should be thrown when start date is missing");
      assert.equal(
        err.code,
        400,
        "Missing start date should result in an HTTP 400 response"
      );
      assert.equal(
        err.message,
        "Missing start date",
        "Error should be thrown because of missing start date"
      );

      reservation.StartDate = "";
      validator.validate(reservation, err => {
        assert(err, "Error should be thrown when start date is missing");
        assert.equal(
          err.code,
          400,
          "Missing start date should result in an HTTP 400 response"
        );
        assert.equal(
          err.message,
          "Missing start date",
          "Error should be thrown because of missing start date"
        );

        done();
      });
    });
  });

  it("should not accept a reservation with missing end date", done => {
    reservation.EndDate = null;
    validator.validate(reservation, err => {
      assert(err, "Error should be thrown when end date is missing");
      assert.equal(
        err.code,
        400,
        "Missing end date should result in an HTTP 400 response"
      );
      assert.equal(
        err.message,
        "Missing end date",
        "Error should be thrown because of missing end date"
      );

      reservation.EndDate = "";
      validator.validate(reservation, err => {
        assert(err, "Error should be thrown when end date is missing");
        assert.equal(
          err.code,
          400,
          "Missing end date should result in an HTTP 400 response"
        );
        assert.equal(
          err.message,
          "Missing end date",
          "Error should be thrown because of missing end date"
        );

        done();
      });
    });
  });
});

// Test if validator handles invalid data
describe("Reservation validator invalid data test", () => {
  it("should accept a reservation with dates as string type", done => {
    reservation.StartDate = startDate.toString();
    reservation.EndDate = endDate.toString();

    validator.validate(reservation, err => {
      assert(!err, "No error should be thrown when dates are given as string");
      done();
    });
  });

  it("should not accept a reservation with invalid start date type", done => {
    reservation.StartDate = 1;

    validator.validate(reservation, err => {
      assert(err, "Error should be thrown when start date type is invalid");
      assert.equal(
        err.code,
        400,
        "Invalid start date type should result in an HTTP 400 respond"
      );
      assert.equal(
        err.message,
        "Invalid start date",
        "Error should be thrown because of start date type"
      );

      done();
    });
  });

  it("should not accept a reservation with invalid end date type", done => {
    reservation.EndDate = 1;

    validator.validate(reservation, err => {
      assert(err, "Error should be thrown when end date type is invalid");
      assert.equal(
        err.code,
        400,
        "Invalid end date type should result in an HTTP 400 respond"
      );
      assert.equal(
        err.message,
        "Invalid end date",
        "Error should be thrown because of end date type"
      );

      done();
    });
  });

  it("should not accept a reservation when start date string format is invalid", done => {
    reservation.StartDate = "2000-10-2000";

    validator.validate(reservation, err => {
      assert(
        err,
        "Error should be thrown when start date string format is invalid"
      );
      assert.equal(
        err.code,
        400,
        "Invalid start date string format should result in an HTTP 400 respond"
      );
      assert.equal(
        err.message,
        "Invalid start date, format should be YYYY-MM-DD",
        "Error should be thrown because of start date string format"
      );

      done();
    });
  });

  it("should not accept a reservation when end date string format is invalid", done => {
    reservation.EndDate = "2000-10-2000";

    validator.validate(reservation, err => {
      assert(
        err,
        "Error should be thrown when end date string format is invalid"
      );
      assert.equal(
        err.code,
        400,
        "Invalid end date string format should result in an HTTP 400 respond"
      );
      assert.equal(
        err.message,
        "Invalid end date, format should be YYYY-MM-DD",
        "Error should be thrown because of end date string format"
      );

      done();
    });
  });

  it("should not accept a reservation when end date comes before start date", done => {
    reservation.StartDate = endDate;
    reservation.EndDate = startDate;

    validator.validate(reservation, err => {
      assert(
        err,
        "Error should be thrown when end date comes before start date"
      );
      assert.equal(
        err.code,
        400,
        "Invalid end date should result in an HTTP 400 respond"
      );
      assert.equal(
        err.message,
        "End date cannot be earlier than start date",
        "Error should be thrown because of end date coming before start date"
      );

      done();
    });
  });

  it("should not accept a reservation when start date is in the past", done => {
    let pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 2);
    reservation.StartDate = pastDate;

    validator.validate(reservation, err => {
      assert(err, "Error should be thrown when start date is in the past");
      assert.equal(
        err.code,
        400,
        "Invalid start date should result in an HTTP 400 respond"
      );
      assert.equal(
        err.message,
        "Start date cannot be in the past",
        "Error should be thrown because of start date being in the past"
      );

      done();
    });
  });

  it("should not accept a reservation when start date is in invalid date object", done => {
    let invalidDate = new Date("2000-10-2000");
    reservation.StartDate = invalidDate;

    validator.validate(reservation, err => {
      assert(
        err,
        "Error should be thrown when start date is an invalid date object"
      );
      assert.equal(
        err.code,
        400,
        "Invalid start date should result in an HTTP 400 respond"
      );
      assert.equal(
        err.message,
        "Start date does not exist",
        "Error should be thrown because of start date being an invalid date object"
      );

      done();
    });
  });

  it("should not accept a reservation when end date is in invalid date object", done => {
    let invalidDate = new Date("2000-10-2000");
    reservation.EndDate = invalidDate;

    validator.validate(reservation, err => {
      assert(
        err,
        "Error should be thrown when end date is an invalid date object"
      );
      assert.equal(
        err.code,
        400,
        "Invalid end date should result in an HTTP 400 respond"
      );
      assert.equal(
        err.message,
        "End date does not exist",
        "Error should be thrown because of end date being an invalid date object"
      );

      done();
    });
  });
});

let status = "ACCEPTED";
beforeEach("Setting up reservation object", () => {
  // Make status value valid again
  status = "ACCEPTED";
});

describe("Reservation status validator test", () => {
  it("should accept a valid status value", done => {
    validator.validateStatus(status, err => {
      assert(!err, "No error should be thrown when status is ACCEPTED");

      status = "NOT_ACCEPTED";
      validator.validateStatus(status, err => {
        assert(!err, "No error should be thrown when status is NOT_ACCEPTED");

        done();
      });
    });
  });

  it("should not accept an invalid status value", done => {
    status = "accepted";

    validator.validateStatus(status, err => {
      assert(err, "Error should be thrown when status is lower case");
      assert.equal(
        err.code,
        400,
        "Lower status status should result in an HTTP 400 response"
      );
      assert.equal(
        err.message,
        "Reservation status can only be changed to ACCEPTED or NOT_ACCEPTED",
        "Error should be based on an invalid value"
      );

      status = "NOTACCEPTED";
      validator.validateStatus(status, err => {
        assert(
          err,
          "Error should be thrown when status is not 'ACCEPTED' or 'NOT_ACCEPTED'"
        );
        assert.equal(
          err.code,
          400,
          "Invalid status should result in an HTTP 400 response"
        );
        assert.equal(
          err.message,
          "Reservation status can only be changed to ACCEPTED or NOT_ACCEPTED",
          "Error should be based on an invalid value"
        );

        done();
      });
    });
  });
});
