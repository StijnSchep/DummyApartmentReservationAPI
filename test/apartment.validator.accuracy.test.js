const assert = require("assert");
const validator = require("../src/business/apartment.validator");

let apartment = {
  Description: "Testing apartment",
  StreetAddress: "Lovensdijkstraat 61",
  PostalCode: "5000 XD",
  City: "Breda"
};

beforeEach("Setting up apartment object", () => {
  // Make apartment values valid again
  apartment = {
    Description: "Testing apartment",
    StreetAddress: "Lovensdijkstraat 61",
    PostalCode: "5000 XD",
    City: "Breda"
  };
});

describe("Apartment validation accuracy test", () => {
  // Check if the validator properly checks the variable types

  it("should not accept an apartment with invalid description type", done => {
    apartment.Description = 1;

    validator.validate(apartment, err => {
      assert(err, "Invalid description type should throw an error");
      assert.equal(
        err.message,
        "Invalid apartment description",
        "Error should be thrown because of description type"
      );
      assert.equal(
        err.code,
        400,
        "Invalid description type should result in an HTTP 400 response"
      );
      done();
    });
  });

  it("should not accept an apartment with invalid address type", done => {
    apartment.StreetAddress = 1;

    validator.validate(apartment, err => {
      assert(err, "Invalid address type should throw an error");
      assert.equal(
        err.message,
        "Missing or invalid street address",
        "Error should be thrown because of address type"
      );
      assert.equal(
        err.code,
        400,
        "Invalid address type should result in an HTTP 400 response"
      );
      done();
    });
  });

  it("should not accept an apartment with invalid postal code type", done => {
    apartment.PostalCode = 1;

    validator.validate(apartment, err => {
      assert(err, "Invalid postal code type should throw an error");
      assert.equal(
        err.message,
        "Missing or invalid postal code",
        "Error should be thrown because of postal code type"
      );
      assert.equal(
        err.code,
        400,
        "Invalid postal code type should result in an HTTP 400 response"
      );
      done();
    });
  });

  it("should not accept an apartment with invalid city type", done => {
    apartment.City = 1;

    validator.validate(apartment, err => {
      assert(err, "Invalid city type should throw an error");
      assert.equal(
        err.message,
        "Missing or invalid city name",
        "Error should be thrown because of city type"
      );
      assert.equal(
        err.code,
        400,
        "Invalid city type should result in an HTTP 400 response"
      );
      done();
    });
  });

  // Check if the validator properly checks patterns with regular expressions

  it("should accept an apartment with valid street address", done => {
    apartment.StreetAddress = "lovensdijkstraat 5";
    validator.validate(apartment, err => {
      assert(
        !err,
        "No error should be thrown for address " + apartment.StreetAddress
      );

      apartment.StreetAddress = "lovensdijkstraat 50A";
      validator.validate(apartment, err => {
        assert(
          !err,
          "No error should be thrown for address " + apartment.StreetAddress
        );
        done();
      });
    });
  });

  it("should not accept an apartment with invalid street address", done => {
    apartment.StreetAddress = "5";
    validator.validate(apartment, err => {
      assert(
        err,
        "Error should be thrown with invalid address " + apartment.StreetAddress
      );
      assert.equal(
        err.code,
        400,
        "Invalid address should result in an HTTP 400 response"
      );
      assert.equal(
        err.message,
        "Invalid street address",
        "Error should be thrown because of invalid address"
      );

      apartment.StreetAddress = "Lovensdijkstraat5";
      validator.validate(apartment, err => {
        assert(
          err,
          "Error should be thrown with invalid address " +
            apartment.StreetAddress
        );
        assert.equal(
          err.code,
          400,
          "Invalid address should result in an HTTP 400 response"
        );
        assert.equal(
          err.message,
          "Invalid street address",
          "Error should be thrown because of invalid address"
        );

        apartment.StreetAddress = "Lovensdijkstraat";
        validator.validate(apartment, err => {
          assert(
            err,
            "Error should be thrown with invalid address " +
              apartment.StreetAddress
          );
          assert.equal(
            err.code,
            400,
            "Invalid address should result in an HTTP 400 response"
          );
          assert.equal(
            err.message,
            "Invalid street address",
            "Error should be thrown because of invalid address"
          );

          apartment.StreetAddress = "Lovensdijkstraat A";
          validator.validate(apartment, err => {
            assert(
              err,
              "Error should be thrown with invalid address " +
                apartment.StreetAddress
            );
            assert.equal(
              err.code,
              400,
              "Invalid address should result in an HTTP 400 response"
            );
            assert.equal(
              err.message,
              "Invalid street address",
              "Error should be thrown because of invalid address"
            );

            done();
          });
        });
      });
    });
  });

  it("should accept an apartment with valid postal code", done => {
    apartment.PostalCode = "5000XD";
    validator.validate(apartment, err => {
      assert(
        !err,
        "No error should be thrown with valid postal code " +
          apartment.PostalCode
      );

      apartment.PostalCode = "5000 xd";
      validator.validate(apartment, err => {
        assert(
          !err,
          "No error should be thrown with valid postal code " +
            apartment.PostalCode
        );

        done();
      });
    });
  });

  it("should not accept an apartment with invalid postal code", done => {
    apartment.PostalCode = "XD";
    validator.validate(apartment, err => {
      assert(
        err,
        "Error should be thrown with invalid postal code " +
          apartment.PostalCode
      );
      assert.equal(
        err.code,
        400,
        "Invalid postal code should result in an HTTP 400 response"
      );
      assert.equal(
        err.message,
        "Invalid postal code",
        "Error should be thrown because of invalid postal code"
      );

      apartment.PostalCode = "5000";
      validator.validate(apartment, err => {
        assert(
          err,
          "Error should be thrown with invalid postal code " +
            apartment.PostalCode
        );
        assert.equal(
          err.code,
          400,
          "Invalid postal code should result in an HTTP 400 response"
        );
        assert.equal(
          err.message,
          "Invalid postal code",
          "Error should be thrown because of invalid postal code"
        );

        apartment.PostalCode = "5000 X";
        validator.validate(apartment, err => {
          assert(
            err,
            "Error should be thrown with invalid postal code " +
              apartment.PostalCode
          );
          assert.equal(
            err.code,
            400,
            "Invalid postal code should result in an HTTP 400 response"
          );
          assert.equal(
            err.message,
            "Invalid postal code",
            "Error should be thrown because of invalid postal code"
          );

          apartment.PostalCode = "5000 50";
          validator.validate(apartment, err => {
            assert(
              err,
              "Error should be thrown with invalid postal code " +
                apartment.PostalCode
            );
            assert.equal(
              err.code,
              400,
              "Invalid postal code should result in an HTTP 400 response"
            );
            assert.equal(
              err.message,
              "Invalid postal code",
              "Error should be thrown because of invalid postal code"
            );

            apartment.PostalCode = "400 XD";
            validator.validate(apartment, err => {
              assert(
                err,
                "Error should be thrown with invalid postal code " +
                  apartment.PostalCode
              );
              assert.equal(
                err.code,
                400,
                "Invalid postal code should result in an HTTP 400 response"
              );
              assert.equal(
                err.message,
                "Invalid postal code",
                "Error should be thrown because of invalid postal code"
              );

              apartment.PostalCode = "400XD";
              validator.validate(apartment, err => {
                assert(
                  err,
                  "Error should be thrown with invalid postal code " +
                    apartment.PostalCode
                );
                assert.equal(
                  err.code,
                  400,
                  "Invalid postal code should result in an HTTP 400 response"
                );
                assert.equal(
                  err.message,
                  "Invalid postal code",
                  "Error should be thrown because of invalid postal code"
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
