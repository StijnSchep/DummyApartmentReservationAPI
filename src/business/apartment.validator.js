module.exports = {
  validate: (apartment, callback) => {
    if (apartment.Description) {
      if (typeof apartment.Description !== "string") {
        const errorObject = {
          message: "Invalid apartment description",
          code: 400
        };

        callback(errorObject);
        return;
      }
    }

    if (typeof apartment.StreetAddress !== "string") {
      const errorObject = {
        message: "Missing or invalid street address",
        code: 400
      };

      callback(errorObject);
      return;
    }

    if (typeof apartment.PostalCode !== "string") {
      const errorObject = {
        message: "Missing or invalid postal code",
        code: 400
      };

      callback(errorObject);
      return;
    }

    const cityValidator = new RegExp("^[a-zA-Z][a-z A-Z0-9-]*$");
    if (
      typeof apartment.City !== "string" ||
      !cityValidator.test(apartment.City)
    ) {
      const errorObject = {
        message: "Missing or invalid city name",
        code: 400
      };

      callback(errorObject);
      return;
    }

    const streetValidator = new RegExp(
      "^[a-zA-Z][a-z A-Z]*[ ][1-9][0-9]*[a-zA-Z]*$"
    );
    const postalcodeValidator = new RegExp("^[1-9][0-9]{3}[ ]?[a-zA-Z]{2}$");

    if (!streetValidator.test(apartment.StreetAddress)) {
      const errorObject = {
        message: "Invalid street address",
        code: 400
      };

      callback(errorObject);
      return;
    }

    if (!postalcodeValidator.test(apartment.PostalCode)) {
      const errorObject = {
        message: "Invalid postal code",
        code: 400
      };

      callback(errorObject);
      return;
    }

    callback();
  }
};
