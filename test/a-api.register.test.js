const chai = require("chai");
const chaiHttp = require("chai-http");
const jwt = require("jsonwebtoken");
const assert = require("assert");
const database = require("../src/data/mssql.dao");
const sql = require("mssql");

const server = require("../src/config/app");

chai.should();
chai.use(chaiHttp);

const loginEndpoint = "/api/login";
const registerEndpoint = "/api/register";
const apartmentEndpoint = "/api/apartments";

// Test if database actions regarding the register are handles well
// Omitted / invalid data handling is testing in seperate tests
describe("API register / login testing", () => {
  //Login: testuserstijn1@avans.nl, testuserstijn2@avans.nl, testuserstijn3@avans.nl
  //Pass: secret

  it("should drop the data information", done => {
    const next = errorObject => {
      console.log(errorObject.message);
    };

    database.connect(next, () => {
      const ps = new sql.PreparedStatement();

      const query =
        "DELETE FROM Reservation; DELETE FROM Apartment; DELETE FROM DBUser";

      database.executeStatement(ps, query, {}, next, data => {
        sql.close();
        done();
      });
    });
  });

  // Add test accounts,
  it("should add an account", done => {
    chai
      .request(server)
      .post(registerEndpoint)
      .set("Content-Type", "application/json")
      .send({
        FirstName: "Pieter",
        LastName: "Jan",
        StreetAddress: "Lovensdijkstraat 61",
        PostalCode: "5000 XD",
        City: "Breda",
        DateOfBirth: "2000-10-10",
        PhoneNumber: "06 83446623",
        EmailAddress: "testuserstijn1@avans.nl",
        Password: "secret"
      })
      .end((err, res) => {
        if (
          res.body.message === "Email address already exists in the database"
        ) {
          done();
          return;
        }

        if (res.body.result.token) {
          done();
          return;
        }

        done(
          "Login test failed, should have registered user or returned that the email already exists"
        );
      });
  });

  it("should add an account", done => {
    chai
      .request(server)
      .post(registerEndpoint)
      .set("Content-Type", "application/json")
      .send({
        FirstName: "Pieter",
        LastName: "Jan",
        StreetAddress: "Lovensdijkstraat 61",
        PostalCode: "5000 XD",
        City: "Breda",
        DateOfBirth: "2000-10-10",
        PhoneNumber: "06 83446623",
        EmailAddress: "testuserstijn2@avans.nl",
        Password: "secret"
      })
      .end((err, res) => {
        if (
          res.body.message === "Email address already exists in the database"
        ) {
          done();
          return;
        }

        if (res.body.result.token) {
          done();
          return;
        }

        done(
          "Login test failed, should have registered user or returned that the email already exists"
        );
      });
  });

  it("should add an account", done => {
    chai
      .request(server)
      .post(registerEndpoint)
      .set("Content-Type", "application/json")
      .send({
        FirstName: "Pieter",
        LastName: "Jan",
        StreetAddress: "Lovensdijkstraat 61",
        PostalCode: "5000 XD",
        City: "Breda",
        DateOfBirth: "2000-10-10",
        PhoneNumber: "06 83446623",
        EmailAddress: "testuserstijn3@avans.nl",
        Password: "secret"
      })
      .end((err, res) => {
        if (
          res.body.message === "Email address already exists in the database"
        ) {
          done();
          return;
        }

        if (res.body.result.token) {
          done();
          return;
        }

        done(
          "Login test failed, should have registered user or returned that the email already exists"
        );
      });
  });

  it("should return an error when email already exists in the database", done => {
    chai
      .request(server)
      .post(registerEndpoint)
      .set("Content-Type", "application/json")
      .send({
        FirstName: "Pieter",
        LastName: "Jan",
        StreetAddress: "Lovensdijkstraat 61",
        PostalCode: "5000 XD",
        City: "Breda",
        DateOfBirth: "2000-10-10",
        PhoneNumber: "06 83446623",
        EmailAddress: "testuserstijn1@avans.nl",
        Password: "secret"
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("message").that.is.a("string");
        res.body.should.have
          .property("message")
          .equals("Email address already exists in the database");
        done();
      });
  });

  it("should return an error when invalid login details are provided", done => {
    chai
      .request(server)
      .post(loginEndpoint)
      .set("Content-Type", "application/json")
      .send({
        EmailAddress: "testuserstijn1@avans.nl",
        Password: "not_so_secret"
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have.property("message").that.is.a("string");
        res.body.should.have
          .property("message")
          .equals("Incorrect Email Address or Password");
        done();
      });
  });

  it("should return an error when login details are missing", done => {
    chai
      .request(server)
      .post(loginEndpoint)
      .set("Content-Type", "application/json")
      .send({
        EmailAddress: "testuserstijn1@avans.nl"
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have.property("message").that.is.a("string");
        res.body.should.have
          .property("message")
          .equals("Incorrect Email Address or Password");
        done();
      });
  });

  // login test is implemented in api.apartment.test and api.reservation.test to get the test user tokens

  it("should deny access when no token is given", done => {
    chai
      .request(server)
      .get(apartmentEndpoint)
      .set("Content-Type", "application/json")
      .send()
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have.property("message").that.is.a("string");
        res.body.should.have
          .property("message")
          .equals("Authorization token missing!");

        done();
      });
  });

  it("should deny access when an invalid token is given", done => {
    chai
      .request(server)
      .get(apartmentEndpoint)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer DAFDFDAJFKLAJFDKJF")
      .send()
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have.property("message").that.is.a("string");
        res.body.should.have
          .property("message")
          .equals("Error validating token");

        done();
      });
  });
});
