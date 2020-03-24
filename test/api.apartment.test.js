const chai = require("chai");
const chaiHttp = require("chai-http");
const assertArrays = require("chai-arrays");
const assert = require("assert");
const jwt = require("jsonwebtoken");

const server = require("../src/config/app");

chai.should();
chai.use(chaiHttp);
chai.use(assertArrays);

const apartmentEndpoint = "/api/apartments/";
const loginEndpoint = "/api/login";

let tokenUser1;
let userId1;
let tokenUser2;
let userId2;
let tokenUser3;
let userId3;

describe("API apartment endpoint testing", () => {
  // Get user tokens for test users
  it("should return a jsonwebtoken when valid login details are provided, test 1", done => {
    chai
      .request(server)
      .post(loginEndpoint)
      .set("Content-Type", "application/json")
      .send({
        EmailAddress: "testuserstijn1@avans.nl",
        Password: "secret"
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("token").that.is.a("string");

        // Check if token is valid by extracting UserId
        const token = res.body.token;
        const key = process.env.JWTKEY || "secretkey";

        jwt.verify(token, key, (err, payload) => {
          if (err) {
            done(err);
          }

          assert(
            payload.UserId,
            "A valid token should return a payload with userId"
          );

          userId1 = payload.UserId;
          tokenUser1 = token;
          done();
        });
      });
  });

  it("should return a jsonwebtoken when valid login details are provided, test 1", done => {
    chai
      .request(server)
      .post(loginEndpoint)
      .set("Content-Type", "application/json")
      .send({
        EmailAddress: "testuserstijn2@avans.nl",
        Password: "secret"
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("token").that.is.a("string");

        // Check if token is valid by extracting UserId
        const token = res.body.token;
        const key = process.env.JWTKEY || "secretkey";

        jwt.verify(token, key, (err, payload) => {
          if (err) {
            done(err);
          }

          assert(
            payload.UserId,
            "A valid token should return a payload with userId"
          );

          userId2 = payload.UserId;
          tokenUser2 = token;
          done();
        });
      });
  });

  it("should return a jsonwebtoken when valid login details are provided, test 1", done => {
    chai
      .request(server)
      .post(loginEndpoint)
      .set("Content-Type", "application/json")
      .send({
        EmailAddress: "testuserstijn3@avans.nl",
        Password: "secret"
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("token").that.is.a("string");

        // Check if token is valid by extracting UserId
        const token = res.body.token;
        const key = process.env.JWTKEY || "secretkey";

        jwt.verify(token, key, (err, payload) => {
          if (err) {
            done(err);
          }

          assert(
            payload.UserId,
            "A valid token should return a payload with userId"
          );

          userId3 = payload.UserId;
          tokenUser3 = token;
          done();
        });
      });
  });

  // Test apartments after getting the user tokens
  it("should show apartments when token is provided, test 1", done => {
    chai
      .request(server)
      .get(apartmentEndpoint)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + tokenUser1)
      .send()
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("result").that.is.an("array");

        done();
      });
  });

  it("should show apartments when token is provided, test 2", done => {
    chai
      .request(server)
      .get(apartmentEndpoint)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + tokenUser2)
      .send()
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("result").that.is.an("array");

        done();
      });
  });

  it("should show apartments when token is provided, test 3", done => {
    chai
      .request(server)
      .get(apartmentEndpoint)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + tokenUser3)
      .send()
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("result").that.is.an("array");

        done();
      });
  });

  let apartmentUser1;
  it("should give an apartmentId when posting an apartment", done => {
    chai
      .request(server)
      .post(apartmentEndpoint)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + tokenUser1)
      .send({
        Description: "Testing apartment user 1",
        StreetAddress: "Lovensdijkstraat 61",
        PostalCode: "5000 XD",
        City: "Breda"
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message").that.is.an("string");
        res.body.should.have
          .property("message")
          .equals("Apartment was succesfully saved");
        res.body.should.have.property("id");

        apartmentUser1 = res.body.id;
        done();
      });
  });

  it("should not allow a user to edit apartment data not owned by user", done => {
    chai
      .request(server)
      .put(apartmentEndpoint + apartmentUser1)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + tokenUser2)
      .send({
        Description: "Apartment now belongs to user 2",
        StreetAddress: "Userstreet 2",
        PostalCode: "2222 XD",
        City: "Groningen"
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have.property("message").that.is.an("string");
        res.body.should.have
          .property("message")
          .equals("You are not permitted to change this data");

        done();
      });
  });

  it("should give the original apartment information when searching on id", done => {
    chai
      .request(server)
      .get(apartmentEndpoint + apartmentUser1)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + tokenUser1)
      .send()
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("result").that.is.an("array");
        res.body.should.have.property("result").ofSize(1);

        const apartment = res.body.result[0];
        assert.equal(
          apartment.ApartmentId,
          apartmentUser1,
          "Result should show apartment with requested ID"
        );
        assert.equal(
          apartment.Description,
          "Testing apartment user 1",
          "Result description should be equal to the original description"
        );
        assert.equal(
          apartment.StreetAddress,
          "Lovensdijkstraat 61",
          "Result address should be equal to the original address"
        );
        assert.equal(
          apartment.PostalCode,
          "5000 XD",
          "Result postal code should be equal to original postal code"
        );
        assert.equal(
          apartment.City,
          "Breda",
          "Result city should be equal to original city"
        );

        const landlord = apartment.Landlord[0];

        assert.deepEqual(
          landlord,
          {
            UserID: userId1,
            FirstName: "Pieter",
            LastName: "Jan",
            StreetAddress: "Lovensdijkstraat 61",
            PostalCode: "5000 XD",
            City: "Breda",
            DateOfBirth: "2000-10-10",
            PhoneNumber: "06 83446623",
            EmailAddress: "testuserstijn1@avans.nl"
          },
          "Result landlord information should be equal to the information of user 1"
        );

        done();
      });
  });

  it("should allow a user to edit their own apartment data", done => {
    chai
      .request(server)
      .put(apartmentEndpoint + apartmentUser1)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + tokenUser1)
      .send({
        Description: "Apartment editted by user 1",
        StreetAddress: "Userstreet 1",
        PostalCode: "1111 XD",
        City: "Breda"
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message").that.is.an("string");
        res.body.should.have
          .property("message")
          .equals("Apartment data was succesfully updated");

        done();
      });
  });

  it("should not allow a user to delete an apartment not owned by them", done => {
    chai
      .request(server)
      .delete(apartmentEndpoint + apartmentUser1)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + tokenUser2)
      .send()
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have.property("message").that.is.an("string");
        res.body.should.have
          .property("message")
          .equals("You are not permitted to delete this data");

        done();
      });
  });

  it("should give the editted apartment data when searching for the ID", done => {
    chai
      .request(server)
      .get(apartmentEndpoint + apartmentUser1)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + tokenUser1)
      .send()
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("result").that.is.an("array");
        res.body.should.have.property("result").ofSize(1);

        const apartment = res.body.result[0];
        assert.equal(
          apartment.ApartmentId,
          apartmentUser1,
          "Result should show apartment with requested ID"
        );
        assert.equal(
          apartment.Description,
          "Apartment editted by user 1",
          "Result description should show new description"
        );
        assert.equal(
          apartment.StreetAddress,
          "Userstreet 1",
          "Result address should show the new address"
        );
        assert.equal(
          apartment.PostalCode,
          "1111 XD",
          "Result postal code should show the new postal code"
        );
        assert.equal(
          apartment.City,
          "Breda",
          "Result city should be equal to original city"
        );

        const landlord = apartment.Landlord[0];
        assert.deepEqual(
          landlord,
          {
            UserID: userId1,
            FirstName: "Pieter",
            LastName: "Jan",
            StreetAddress: "Lovensdijkstraat 61",
            PostalCode: "5000 XD",
            City: "Breda",
            DateOfBirth: "2000-10-10",
            PhoneNumber: "06 83446623",
            EmailAddress: "testuserstijn1@avans.nl"
          },
          "Result landlord information should be equal to the information of user 1"
        );

        done();
      });
  });

  it("should remove an apartment when the correct user is logged in", done => {
    chai
      .request(server)
      .delete(apartmentEndpoint + apartmentUser1)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + tokenUser1)
      .send()
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message").that.is.an("string");
        res.body.should.have
          .property("message")
          .equals("Apartment data was succesfully deleted");

        done();
      });
  });

  it("should throw an error when removing a non-existing apartment", done => {
    chai
      .request(server)
      .delete(apartmentEndpoint + apartmentUser1)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + tokenUser1)
      .send()
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have.property("message").that.is.an("string");
        res.body.should.have
          .property("message")
          .equals("No apartment found with this ID");

        done();
      });
  });

  it("should give an error when attempting to edit with a non-existing id", done => {
    chai
      .request(server)
      .put(apartmentEndpoint + apartmentUser1)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + tokenUser2)
      .send({
        Description: "apartment edit",
        StreetAddress: "Userstreet 2",
        PostalCode: "2222 XD",
        City: "Breda"
      })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have.property("message").that.is.an("string");
        res.body.should.have
          .property("message")
          .equals("No apartment found with this ID");

        done();
      });
  });

  it("should give an error when searching for an non-existing id", done => {
    chai
      .request(server)
      .get(apartmentEndpoint + apartmentUser1)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + tokenUser1)
      .send()
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have.property("message").that.is.an("string");
        res.body.should.have
          .property("message")
          .equals("No apartment found with this ID");

        done();
      });
  });
});
