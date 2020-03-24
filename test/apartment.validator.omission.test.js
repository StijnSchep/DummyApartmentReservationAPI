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

describe("Apartment validation omitted data test", () => {
  it("should accept an apartment with all data included", done => {
    validator.validate(apartment, err => {
      assert(!err, "No error should be given when apartment is valid");
      done();
    });
  });

  it("should accept an apartment without description", done => {
    apartment.Description = null;

    validator.validate(apartment, err => {
      assert(!err, "Omission of description should not cause an error");
      done();
    });
  });

  it("should not accept an apartment without address", done => {
    apartment.StreetAddress = null;
    validator.validate(apartment, err => {
      assert(err, "Omission of apartment address should throw an error");
      assert.equal(
        err.message,
        "Missing or invalid street address",
        "Error should be thrown for lack of an address"
      );
      assert.equal(
        err.code,
        400,
        "Omitted address should result in an HTTP 400 response"
      );

      apartment.StreetAddress = "";
      validator.validate(apartment, err => {
        assert(err, "Omission of apartment address should throw an error");
        assert.equal(
          err.message,
          "Invalid street address",
          "Error should be thrown for lack of an address"
        );
        assert.equal(
          err.code,
          400,
          "Omitted address should result in an HTTP 400 response"
        );

        done();
      });
    });
  });

  it("should not accept an apartment without Postal Code", done => {
    apartment.PostalCode = null;
    validator.validate(apartment, err => {
      assert(err, "Omission of apartment postal code should throw an error");
      assert.equal(
        err.message,
        "Missing or invalid postal code",
        "Error should be thrown for lack of a postal code"
      );
      assert.equal(
        err.code,
        400,
        "Omitted postal code should result in an HTTP 400 response"
      );

      apartment.PostalCode = "";
      validator.validate(apartment, err => {
        assert(err, "Omission of apartment postal code should throw an error");
        assert.equal(
          err.message,
          "Invalid postal code",
          "Error should be thrown for lack of a postal code"
        );
        assert.equal(
          err.code,
          400,
          "Omitted postal code should result in an HTTP 400 response"
        );

        done();
      });
    });
  });

  it("should not accept an apartment without city name", done => {
    apartment.City = null;
    validator.validate(apartment, err => {
      assert(err, "Omission of apartment city name should throw an error");
      assert.equal(
        err.message,
        "Missing or invalid city name",
        "Error should be thrown for lack of a city name"
      );
      assert.equal(
        err.code,
        400,
        "Omitted city name should result in an HTTP 400 response"
      );

      apartment.City = "";
      validator.validate(apartment, err => {
        assert(err, "Omission of apartment city name should throw an error");
        assert.equal(
          err.message,
          "Missing or invalid city name",
          "Error should be thrown for lack of a city name"
        );
        assert.equal(
          err.code,
          400,
          "Omitted city name should result in an HTTP 400 response"
        );

        done();
      });
    });
  });
});
