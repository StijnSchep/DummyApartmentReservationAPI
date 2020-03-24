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

// Test if the validator can handle invalid data
describe("User validation type handling test", () => {
  it("should not accept a user when invalid first name type", done => {
    user.FirstName = 1;

    validator.validate(user, err => {
      assert(err, "Error should be thrown when first name type is invalid");
      assert.equal(
        err.code,
        400,
        "Invalid first name type should result in an HTTP 400 response"
      );
      assert.equal(
        err.message,
        "Missing or invalid first name",
        "Message should be thrown because of invalid first name"
      );

      done();
    });
  });

  it("should not accept a user when invalid last name type", done => {
    user.LastName = 1;

    validator.validate(user, err => {
      assert(err, "Error should be thrown when last name type is invalid");
      assert.equal(
        err.code,
        400,
        "Invalid last name type should result in an HTTP 400 response"
      );
      assert.equal(
        err.message,
        "Missing or invalid last name",
        "Message should be thrown because of invalid last name"
      );

      done();
    });
  });

  it("should not accept a user when invalid street address type", done => {
    user.StreetAddress = 1;

    validator.validate(user, err => {
      assert(err, "Error should be thrown when street address type is invalid");
      assert.equal(
        err.code,
        400,
        "Invalid street address type should result in an HTTP 400 response"
      );
      assert.equal(
        err.message,
        "Missing or invalid street address",
        "Message should be thrown because of invalid street address"
      );

      done();
    });
  });

  it("should not accept a user when invalid postal code type", done => {
    user.PostalCode = 1;

    validator.validate(user, err => {
      assert(err, "Error should be thrown when postal code type is invalid");
      assert.equal(
        err.code,
        400,
        "Invalid postal code type should result in an HTTP 400 response"
      );
      assert.equal(
        err.message,
        "Missing or invalid postal code",
        "Message should be thrown because of invalid postal code"
      );

      done();
    });
  });

  it("should not accept a user when invalid city name type", done => {
    user.City = 1;

    validator.validate(user, err => {
      assert(err, "Error should be thrown when city name type is invalid");
      assert.equal(
        err.code,
        400,
        "Invalid city name type should result in an HTTP 400 response"
      );
      assert.equal(
        err.message,
        "Missing or invalid city name",
        "Message should be thrown because of invalid city name"
      );

      done();
    });
  });

  it("should not accept a user when invalid date of birth type", done => {
    user.DateOfBirth = 1;

    validator.validate(user, err => {
      assert(err, "Error should be thrown when date of birth type is invalid");
      assert.equal(
        err.code,
        400,
        "Invalid date of birth type should result in an HTTP 400 response"
      );
      assert.equal(
        err.message,
        "Missing or invalid date of birth",
        "Message should be thrown because of invalid date of birth"
      );

      done();
    });
  });

  it("should not accept a user when invalid phone number type", done => {
    user.PhoneNumber = 1;

    validator.validate(user, err => {
      assert(err, "Error should be thrown when phone number type is invalid");
      assert.equal(
        err.code,
        400,
        "Invalid phone number type should result in an HTTP 400 response"
      );
      assert.equal(
        err.message,
        "Missing or invalid phone number",
        "Message should be thrown because of invalid phone number"
      );

      done();
    });
  });

  it("should not accept a user when invalid email address type", done => {
    user.EmailAddress = 1;

    validator.validate(user, err => {
      assert(err, "Error should be thrown when email address type is invalid");
      assert.equal(
        err.code,
        400,
        "Invalid email address type should result in an HTTP 400 response"
      );
      assert.equal(
        err.message,
        "Missing or invalid email address",
        "Message should be thrown because of invalid email address"
      );

      done();
    });
  });

  it("should not accept a user when invalid password type", done => {
    user.Password = 1;

    validator.validate(user, err => {
      assert(err, "Error should be thrown when password type is invalid");
      assert.equal(
        err.code,
        400,
        "Invalid password type should result in an HTTP 400 response"
      );
      assert.equal(
        err.message,
        "Missing or invalid password",
        "Message should be thrown because of invalid password"
      );

      done();
    });
  });
});

describe("User validation accuracy test", () => {
  it("should accept a user with valid first name", done => {
    user.FirstName = "Jan-Piet";
    validator.validate(user, err => {
      assert(!err, "No error should be thrown when first name is valid");

      user.FirstName = "Jan klaas";
      validator.validate(user, err => {
        assert(!err, "No error should be thrown when first name is valid");

        done();
      });
    });
  });

  it("should not accept a user with invalid first name", done => {
    user.FirstName = "100";

    validator.validate(user, err => {
      assert(err, "Error should be thrown when first name is invalid");
      assert.equal(
        err.code,
        400,
        "Invalid first name should result in an HTTP 400 response"
      );
      assert.equal(
        err.message,
        "Missing or invalid first name",
        "Message should be thrown because of invalid first name"
      );

      done();
    });
  });

  it("should accept a user with valid last name", done => {
    user.FirstName = "bon-jo";
    validator.validate(user, err => {
      assert(!err, "No error should be thrown when last name is valid");

      user.FirstName = "Bon Jo";
      validator.validate(user, err => {
        assert(!err, "No error should be thrown when last name is valid");

        done();
      });
    });
  });

  it("should not accept a user with invalid last name", done => {
    user.LastName = "100";

    validator.validate(user, err => {
      assert(err, "Error should be thrown when last name is invalid");
      assert.equal(
        err.code,
        400,
        "Invalid last name should result in an HTTP 400 response"
      );
      assert.equal(
        err.message,
        "Missing or invalid last name",
        "Message should be thrown because of invalid last name"
      );

      done();
    });
  });

  it("should accept a user with valid street address", done => {
    user.StreetAddress = "lovensdijkstraat 60A";
    validator.validate(user, err => {
      assert(
        !err,
        "No error should be thrown when street address is " + user.StreetAddress
      );

      user.StreetAddress = "lovensdijkstraat 6";
      validator.validate(user, err => {
        assert(
          !err,
          "No error should be thrown when street address is " +
            user.StreetAddress
        );

        user.StreetAddress = "gele berk 6";
        validator.validate(user, err => {
          assert(
            !err,
            "No error should be thrown when street address is " +
              user.StreetAddress
          );
          done();
        });
      });
    });
  });

  it("should not accept a user with invalid street address", done => {
    user.StreetAddress = "60A";
    validator.validate(user, err => {
      assert(
        err,
        "Error should be thrown when street address is " + user.StreetAddress
      );
      assert.equal(
        err.code,
        400,
        "Invalid street address should result in an HTTP 400 response"
      );
      assert.equal(
        err.message,
        "Missing or invalid street address",
        "Error should be thrown because of invalid street address"
      );

      user.StreetAddress = "60";
      validator.validate(user, err => {
        assert(
          err,
          "Error should be thrown when street address is " + user.StreetAddress
        );
        assert.equal(
          err.code,
          400,
          "Invalid street address should result in an HTTP 400 response"
        );
        assert.equal(
          err.message,
          "Missing or invalid street address",
          "Error should be thrown because of invalid street address"
        );

        user.StreetAddress = "lovensdijkstraat";
        validator.validate(user, err => {
          assert(
            err,
            "Error should be thrown when street address is " +
              user.StreetAddress
          );
          assert.equal(
            err.code,
            400,
            "Invalid street address should result in an HTTP 400 response"
          );
          assert.equal(
            err.message,
            "Missing or invalid street address",
            "Error should be thrown because of invalid street address"
          );

          user.StreetAddress = "60 A";
          validator.validate(user, err => {
            assert(
              err,
              "Error should be thrown when street address is " +
                user.StreetAddress
            );
            assert.equal(
              err.code,
              400,
              "Invalid street address should result in an HTTP 400 response"
            );
            assert.equal(
              err.message,
              "Missing or invalid street address",
              "Error should be thrown because of invalid street address"
            );

            done();
          });
        });
      });
    });
  });

  it("should accept a user with valid postal code", done => {
    user.PostalCode = "5000XD";
    validator.validate(user, err => {
      assert(
        !err,
        "No error should be thrown when postal code is " + user.PostalCode
      );

      user.PostalCode = "5000xd";
      validator.validate(user, err => {
        assert(
          !err,
          "No error should be thrown when postal code is " + user.PostalCode
        );

        user.PostalCode = "5000 xd";
        validator.validate(user, err => {
          assert(
            !err,
            "No error should be thrown when postal code is " + user.PostalCode
          );

          done();
        });
      });
    });
  });

  it("should not accept a user with invalid postal code", done => {
    user.PostalCode = "5000";
    validator.validate(user, err => {
      assert(err, "Error should be thrown with postal code " + user.PostalCode);
      assert.equal(
        err.code,
        400,
        "Invalid postal code should result in an HTTP 400 response"
      );
      assert.equal(
        err.message,
        "Missing or invalid postal code",
        "Error should be thrown because of invalid postal code"
      );

      user.PostalCode = "XD";
      validator.validate(user, err => {
        assert(
          err,
          "Error should be thrown with postal code " + user.PostalCode
        );
        assert.equal(
          err.code,
          400,
          "Invalid postal code should result in an HTTP 400 response"
        );
        assert.equal(
          err.message,
          "Missing or invalid postal code",
          "Error should be thrown because of invalid postal code"
        );

        user.PostalCode = "500 XD";
        validator.validate(user, err => {
          assert(
            err,
            "Error should be thrown with postal code " + user.PostalCode
          );
          assert.equal(
            err.code,
            400,
            "Invalid postal code should result in an HTTP 400 response"
          );
          assert.equal(
            err.message,
            "Missing or invalid postal code",
            "Error should be thrown because of invalid postal code"
          );

          user.PostalCode = "XD 5000";
          validator.validate(user, err => {
            assert(
              err,
              "Error should be thrown with postal code " + user.PostalCode
            );
            assert.equal(
              err.code,
              400,
              "Invalid postal code should result in an HTTP 400 response"
            );
            assert.equal(
              err.message,
              "Missing or invalid postal code",
              "Error should be thrown because of invalid postal code"
            );

            done();
          });
        });
      });
    });
  });

  it("should accept a user with valid date of birth", done => {
    user.DateOfBirth = "2000-1-1";
    validator.validate(user, err => {
      assert(!err, "No error should be thrown with valid date of birth string");

      user.DateOfBirth = new Date("2000-1-1");
      validator.validate(user, err => {
        assert(
          !err,
          "No error should be thrown with valid date of birth object"
        );

        done();
      });
    });
  });

  it("should not accept a user with invalid date of birth", done => {
    user.DateOfBirth = "2000-1-0";
    validator.validate(user, err => {
      assert(err, "Error should be thrown with invalid date of birth string");
      assert.equal(
        err.code,
        400,
        "Invalid date of birth should result in an HTTP 400 response"
      );
      assert.equal(
        err.message,
        "Missing or invalid date of birth",
        "Error should be thrown because of invalid date of birth"
      );

      user.DateOfBirth = new Date("2000-10-0");
      validator.validate(user, err => {
        assert(err, "Error should be thrown with invalid date of birth object");
        assert.equal(
          err.code,
          400,
          "Invalid date of birth should result in an HTTP 400 response"
        );
        assert.equal(
          err.message,
          "Missing or invalid date of birth",
          "Error should be thrown because of invalid date of birth"
        );

        done();
      });
    });
  });

  it("should accept a user with valid phone number", done => {
    user.PhoneNumber = "0683446623";
    validator.validate(user, err => {
      assert(
        !err,
        "No error should be thrown with phone number " + user.PhoneNumber
      );

      user.PhoneNumber = "06-83446623";
      validator.validate(user, err => {
        assert(
          !err,
          "No error should be thrown with phone number " + user.PhoneNumber
        );

        user.PhoneNumber = "(06)83446623";
        validator.validate(user, err => {
          assert(
            !err,
            "No error should be thrown with phone number " + user.PhoneNumber
          );

          user.PhoneNumber = "(06) 83446623";
          validator.validate(user, err => {
            assert(
              !err,
              "No error should be thrown with phone number " + user.PhoneNumber
            );

            user.PhoneNumber = "+31 6 83446623";
            validator.validate(user, err => {
              assert(
                !err,
                "No error should be thrown with phone number " +
                  user.PhoneNumber
              );

              user.PhoneNumber = "+31 06 83446623";
              validator.validate(user, err => {
                assert(
                  !err,
                  "No error should be thrown with phone number " +
                    user.PhoneNumber
                );

                user.PhoneNumber = "+31 06-83446623";
                validator.validate(user, err => {
                  assert(
                    !err,
                    "No error should be thrown with phone number " +
                      user.PhoneNumber
                  );

                  user.PhoneNumber = "+31 (06) 83446623";
                  validator.validate(user, err => {
                    assert(
                      !err,
                      "No error should be thrown with phone number " +
                        user.PhoneNumber
                    );
                    done();
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  it("should not accept a user with invalid phone number", done => {
    user.PhoneNumber = "+31 83446623";
    validator.validate(user, err => {
      assert(
        err,
        "Error should be thrown with phone number " + user.PhoneNumber
      );
      assert.equal(
        err.code,
        400,
        "Invalid phone number should result in an HTTP 400 response"
      );
      assert.equal(
        err.message,
        "Missing or invalid phone number",
        "Error should be thrown because of invalid phone number"
      );

      user.PhoneNumber = "31 06 83446623";
      validator.validate(user, err => {
        assert(
          err,
          "Error should be thrown with phone number " + user.PhoneNumber
        );
        assert.equal(
          err.code,
          400,
          "Invalid phone number should result in an HTTP 400 response"
        );
        assert.equal(
          err.message,
          "Missing or invalid phone number",
          "Error should be thrown because of invalid phone number"
        );

        user.PhoneNumber = "fdafadfad";
        validator.validate(user, err => {
          assert(
            err,
            "Error should be thrown with phone number " + user.PhoneNumber
          );
          assert.equal(
            err.code,
            400,
            "Invalid phone number should result in an HTTP 400 response"
          );
          assert.equal(
            err.message,
            "Missing or invalid phone number",
            "Error should be thrown because of invalid phone number"
          );

          user.PhoneNumber = "+31 06 8344662";
          validator.validate(user, err => {
            assert(
              err,
              "Error should be thrown with phone number " + user.PhoneNumber
            );
            assert.equal(
              err.code,
              400,
              "Invalid phone number should result in an HTTP 400 response"
            );
            assert.equal(
              err.message,
              "Missing or invalid phone number",
              "Error should be thrown because of invalid phone number"
            );

            user.PhoneNumber = "+31 8344662d";
            validator.validate(user, err => {
              assert(
                err,
                "Error should be thrown with phone number " + user.PhoneNumber
              );
              assert.equal(
                err.code,
                400,
                "Invalid phone number should result in an HTTP 400 response"
              );
              assert.equal(
                err.message,
                "Missing or invalid phone number",
                "Error should be thrown because of invalid phone number"
              );

              user.PhoneNumber = "+31 83446623";
              validator.validate(user, err => {
                assert(
                  err,
                  "Error should be thrown with phone number " + user.PhoneNumber
                );
                assert.equal(
                  err.code,
                  400,
                  "Invalid phone number should result in an HTTP 400 response"
                );
                assert.equal(
                  err.message,
                  "Missing or invalid phone number",
                  "Error should be thrown because of invalid phone number"
                );

                done();
              });
            });
          });
        });
      });
    });
  });

  it("should accept a user with valid email address", done => {
    user.EmailAddress = "ss.schep@student.avans.nl";
    validator.validate(user, err => {
      assert(
        !err,
        "No error should be thrown when email address is " + user.EmailAddress
      );

      user.EmailAddress = "ssschep@student.avans.nl";
      validator.validate(user, err => {
        assert(
          !err,
          "No error should be thrown when email address is " + user.EmailAddress
        );

        user.EmailAddress = "ssschep@studentavans.nl";
        validator.validate(user, err => {
          assert(
            !err,
            "No error should be thrown when email address is " +
              user.EmailAddress
          );

          user.EmailAddress = "Stijn2000@studentavans.nl";
          validator.validate(user, err => {
            assert(
              !err,
              "No error should be thrown when email address is " +
                user.EmailAddress
            );

            done();
          });
        });
      });
    });
  });

  it("should not accept a user with invalid email address", done => {
    user.EmailAddress = "ssschepavans.nl";
    validator.validate(user, err => {
      assert(
        err,
        "Error should be thrown when email address is " + user.EmailAddress
      );
      assert.equal(
        err.code,
        400,
        "Invalid email address should result in an HTTP 400 response"
      );
      assert.equal(
        err.message,
        "Missing or invalid email address",
        "Error should be thrown because of invalid email address"
      );

      user.EmailAddress = "ssschep@avans";
      validator.validate(user, err => {
        assert(
          err,
          "Error should be thrown when email address is " + user.EmailAddress
        );
        assert.equal(
          err.code,
          400,
          "Invalid email address should result in an HTTP 400 response"
        );
        assert.equal(
          err.message,
          "Missing or invalid email address",
          "Error should be thrown because of invalid email address"
        );

        user.EmailAddress = "@avans.nl";
        validator.validate(user, err => {
          assert(
            err,
            "Error should be thrown when email address is " + user.EmailAddress
          );
          assert.equal(
            err.code,
            400,
            "Invalid email address should result in an HTTP 400 response"
          );
          assert.equal(
            err.message,
            "Missing or invalid email address",
            "Error should be thrown because of invalid email address"
          );

          user.EmailAddress = "ssschep@.nl";
          validator.validate(user, err => {
            assert(
              err,
              "Error should be thrown when email address is " +
                user.EmailAddress
            );
            assert.equal(
              err.code,
              400,
              "Invalid email address should result in an HTTP 400 response"
            );
            assert.equal(
              err.message,
              "Missing or invalid email address",
              "Error should be thrown because of invalid email address"
            );

            done();
          });
        });
      });
    });
  });
});
