const validator = require("../src/business/user.validator");
const assert = require("assert");

let user = {
  FirstName: "Pieter",
  LastName: "Jan",
  StreetAddress: "Lovensdijkstraat 61",
  PostalCode: "5000 XD",
  City: "Breda",
  DateOfBirth: "2000-10-10",
  PhoneNumber: "06 83446623",
  EmailAddress: "ssschep@avans.nl",
  Password: "secret"
};

beforeEach("Resetting user information to valid data", () => {
  user = {
    FirstName: "Pieter",
    LastName: "Jan",
    StreetAddress: "Lovensdijkstraat 61",
    PostalCode: "5000 XD",
    City: "Breda",
    DateOfBirth: "2000-10-10",
    PhoneNumber: "06 83446623",
    EmailAddress: "ssschep@avans.nl",
    Password: "secret"
  };
});

// Test if the validator can handle omitted data
describe("User validation omitted data test", () => {
  it("should accept a user with valid data", done => {
    validator.validate(user, err => {
      assert(!err, "No error should be thrown when user data is valid");
      done();
    });
  });

  it("should not accept a user with missing first name", done => {
    user.FirstName = null;
    validator.validate(user, err => {
      assert(err, "Error should be thrown when user misses first name");
      assert.equal(
        err.code,
        400,
        "Missing first name should result in an HTTP 400 response"
      );
      assert.equal(
        err.message,
        "Missing or invalid first name",
        "Error should be thrown because of missing first name"
      );

      user.FirstName = "";
      validator.validate(user, err => {
        assert(err, "Error should be thrown when user misses first name");
        assert.equal(
          err.code,
          400,
          "Missing first name should result in an HTTP 400 response"
        );
        assert.equal(
          err.message,
          "Missing or invalid first name",
          "Error should be thrown because of missing first name"
        );

        done();
      });
    });
  });

  it("should not accept a user with missing last name", done => {
    user.LastName = null;
    validator.validate(user, err => {
      assert(err, "Error should be thrown when user misses last name");
      assert.equal(
        err.code,
        400,
        "Missing last name should result in an HTTP 400 response"
      );
      assert.equal(
        err.message,
        "Missing or invalid last name",
        "Error should be thrown because of missing last name"
      );

      user.LastName = "";
      validator.validate(user, err => {
        assert(err, "Error should be thrown when user misses last name");
        assert.equal(
          err.code,
          400,
          "Missing last name should result in an HTTP 400 response"
        );
        assert.equal(
          err.message,
          "Missing or invalid last name",
          "Error should be thrown because of missing last name"
        );

        done();
      });
    });
  });

  it("should not accept a user with missing first name", done => {
    user.StreetAddress = null;
    validator.validate(user, err => {
      assert(err, "Error should be thrown when user misses address");
      assert.equal(
        err.code,
        400,
        "Missing address should result in an HTTP 400 response"
      );
      assert.equal(
        err.message,
        "Missing or invalid street address",
        "Error should be thrown because of missing address"
      );

      user.StreetAddress = "";
      validator.validate(user, err => {
        assert(err, "Error should be thrown when user misses address");
        assert.equal(
          err.code,
          400,
          "Missing address should result in an HTTP 400 response"
        );
        assert.equal(
          err.message,
          "Missing or invalid street address",
          "Error should be thrown because of missing address"
        );

        done();
      });
    });
  });

  it("should not accept a user with missing postal code", done => {
    user.PostalCode = null;
    validator.validate(user, err => {
      assert(err, "Error should be thrown when user misses postal code");
      assert.equal(
        err.code,
        400,
        "Missing postal code should result in an HTTP 400 response"
      );
      assert.equal(
        err.message,
        "Missing or invalid postal code",
        "Error should be thrown because of missing postal code"
      );

      user.PostalCode = "";
      validator.validate(user, err => {
        assert(err, "Error should be thrown when user misses postal code");
        assert.equal(
          err.code,
          400,
          "Missing postal code should result in an HTTP 400 response"
        );
        assert.equal(
          err.message,
          "Missing or invalid postal code",
          "Error should be thrown because of missing postal code"
        );

        done();
      });
    });
  });

  it("should not accept a user with missing city name", done => {
    user.City = null;
    validator.validate(user, err => {
      assert(err, "Error should be thrown when user misses city name");
      assert.equal(
        err.code,
        400,
        "Missing city name should result in an HTTP 400 response"
      );
      assert.equal(
        err.message,
        "Missing or invalid city name",
        "Error should be thrown because of missing city name"
      );

      user.City = "";
      validator.validate(user, err => {
        assert(err, "Error should be thrown when user misses city name");
        assert.equal(
          err.code,
          400,
          "Missing city name should result in an HTTP 400 response"
        );
        assert.equal(
          err.message,
          "Missing or invalid city name",
          "Error should be thrown because of missing city name"
        );

        done();
      });
    });
  });

  it("should not accept a user with missing date of birth", done => {
    user.DateOfBirth = null;
    validator.validate(user, err => {
      assert(err, "Error should be thrown when user misses date of birth");
      assert.equal(
        err.code,
        400,
        "Missing date of birth should result in an HTTP 400 response"
      );
      assert.equal(
        err.message,
        "Missing or invalid date of birth",
        "Error should be thrown because of missing date of birth"
      );

      user.DateOfBirth = "";
      validator.validate(user, err => {
        assert(err, "Error should be thrown when user misses date of birth");
        assert.equal(
          err.code,
          400,
          "Missing date of birth should result in an HTTP 400 response"
        );
        assert.equal(
          err.message,
          "Missing or invalid date of birth",
          "Error should be thrown because of missing date of birth"
        );

        done();
      });
    });
  });

  it("should not accept a user with missing phone number", done => {
    user.PhoneNumber = null;
    validator.validate(user, err => {
      assert(err, "Error should be thrown when user misses phone number");
      assert.equal(
        err.code,
        400,
        "Missing phone number should result in an HTTP 400 response"
      );
      assert.equal(
        err.message,
        "Missing or invalid phone number",
        "Error should be thrown because of missing phone number"
      );

      user.PhoneNumber = "";
      validator.validate(user, err => {
        assert(err, "Error should be thrown when user misses phone number");
        assert.equal(
          err.code,
          400,
          "Missing phone number should result in an HTTP 400 response"
        );
        assert.equal(
          err.message,
          "Missing or invalid phone number",
          "Error should be thrown because of missing phone number"
        );

        done();
      });
    });
  });

  it("should not accept a user with missing email address", done => {
    user.EmailAddress = null;

    validator.validate(user, err => {
      assert(err, "Error should be thrown when user misses email address");
      assert.equal(
        err.code,
        400,
        "Missing email address should result in an HTTP 400 response"
      );
      assert.equal(
        err.message,
        "Missing or invalid email address",
        "Error should be thrown because of missing email address"
      );

      user.EmailAddress = "";
      validator.validate(user, err => {
        assert(err, "Error should be thrown when user misses email address");
        assert.equal(
          err.code,
          400,
          "Missing email address should result in an HTTP 400 response"
        );
        assert.equal(
          err.message,
          "Missing or invalid email address",
          "Error should be thrown because of missing email address"
        );

        done();
      });
    });
  });

  it("should not accept a user with missing password", done => {
    user.Password = null;

    validator.validate(user, err => {
      assert(err, "Error should be thrown when user misses password");
      assert.equal(
        err.code,
        400,
        "Missing password should result in an HTTP 400 response"
      );
      assert.equal(
        err.message,
        "Missing or invalid password",
        "Error should be thrown because of missing password"
      );

      user.Password = "";
      validator.validate(user, err => {
        assert(err, "Error should be thrown when user misses password");
        assert.equal(
          err.code,
          400,
          "Missing password should result in an HTTP 400 response"
        );
        assert.equal(
          err.message,
          "Missing or invalid password",
          "Error should be thrown because of missing password"
        );

        done();
      });
    });
  });
});
