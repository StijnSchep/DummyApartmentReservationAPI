module.exports = {
  validate: (user, callback) => {
    /* --- FIRST NAME CHECK --- */

    const nameValidator = new RegExp("^[a-zA-Z][a-z A-Z-]*$");
    if (
      typeof user.FirstName !== "string" ||
      !nameValidator.test(user.FirstName)
    ) {
      const errorObject = {
        message: "Missing or invalid first name",
        code: 400
      };

      callback(errorObject);
      return;
    }

    /* --- LAST NAME CHECK --- */

    if (
      typeof user.LastName !== "string" ||
      !nameValidator.test(user.LastName)
    ) {
      const errorObject = {
        message: "Missing or invalid last name",
        code: 400
      };

      callback(errorObject);
      return;
    }

    /* --- STREET ADDRESS CHECK --- */

    const streetValidator = new RegExp(
      "^[a-zA-Z][a-z A-Z]*[ ][1-9][0-9]*[a-zA-Z]*$"
    );
    if (
      typeof user.StreetAddress !== "string" ||
      !streetValidator.test(user.StreetAddress)
    ) {
      const errorObject = {
        message: "Missing or invalid street address",
        code: 400
      };

      callback(errorObject);
      return;
    }

    /* --- POSTAL CODE CHECK --- */

    const postalcodeValidator = new RegExp("^[1-9][0-9]{3}[ ]?[a-zA-Z]{2}$");
    if (
      typeof user.PostalCode !== "string" ||
      !postalcodeValidator.test(user.PostalCode)
    ) {
      const errorObject = {
        message: "Missing or invalid postal code",
        code: 400
      };

      callback(errorObject);
      return;
    }

    /* --- CITY NAME CHECK --- */

    const cityValidator = new RegExp("^[a-zA-Z][a-z A-Z0-9-]*$");
    if (typeof user.City !== "string" || !cityValidator.test(user.City)) {
      const errorObject = {
        message: "Missing or invalid city name",
        code: 400
      };

      callback(errorObject);
      return;
    }

    /* --- DATE OF BIRTH CHECK --- */

    if (typeof user.DateOfBirth === "string") {
      user.DateOfBirth = new Date(user.DateOfBirth);
    }

    if (!(user.DateOfBirth instanceof Date) || isNaN(user.DateOfBirth)) {
      const errorObject = {
        message: "Missing or invalid date of birth",
        code: 400
      };

      callback(errorObject);
      return;
    }

    /* --- PHONE NUMBER CHECK --- */

    const phoneValidator1 = new RegExp(
      "^(((0)[1-9]{2}[0-9][-]?[1-9][0-9]{5})|((\\+31|0|0031)[1-9][0-9][-]?[1-9][0-9]{6}))$"
    );
    const phoneValidator2 = new RegExp(
      "^(\\+31)?[ ]?[(]?[0-9]{1,3}[)]?[  -]?[1-9]{1}[0-9]{7}$"
    );
    if (
      typeof user.PhoneNumber !== "string" ||
      !(
        phoneValidator1.test(user.PhoneNumber) ||
        phoneValidator2.test(user.PhoneNumber)
      )
    ) {
      const errorObject = {
        message: "Missing or invalid phone number",
        code: 400
      };

      callback(errorObject);
      return;
    }

    /* --- EMAIL ADDRESS CHECK --- */

    const emailValidator = new RegExp(
      "^[a-zA-Z0-9][a-z.A-Z0-9]*@[a-zA-Z0-9][a-z.A-Z0-9]*[.][a-zA-Z]*$"
    );
    if (
      typeof user.EmailAddress !== "string" ||
      !emailValidator.test(user.EmailAddress)
    ) {
      const errorObject = {
        message: "Missing or invalid email address",
        code: 400
      };

      callback(errorObject);
      return;
    }

    /* --- PASSWORD CHECK --- */

    if (typeof user.Password !== "string" || user.Password === "") {
      const errorObject = {
        message: "Missing or invalid password",
        code: 400
      };

      callback(errorObject);
      return;
    }

    callback(null);
  }
};
