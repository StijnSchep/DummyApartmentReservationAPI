const chai = require("chai");
const chaiHttp = require("chai-http");
const assertArrays = require("chai-arrays");
const assert = require("assert");
const jwt = require("jsonwebtoken");
const dateCheck = require("./date.comparitor.js");

const server = require("../src/config/app");

chai.should();
chai.use(chaiHttp);
chai.use(assertArrays);

const apartmentEndpoint = "/api/apartments/";
const loginEndpoint = "/api/login";
let apartmentUser1;
let tokenUser1;
let tokenUser2;
let tokenUser3;

describe("API reservation endpoint testing", () => {
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

          tokenUser3 = token;
          done();
        });
      });
  });

  // Use test from api.apartment.test.js to get a test case apartment
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

  it("should return an error when searching for reservations on a new apartment", done => {
    chai
      .request(server)
      .get(apartmentEndpoint + apartmentUser1 + "/reservations")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + tokenUser1)
      .send()
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property("message").that.is.an("string");
        res.body.should.have
          .property("message")
          .equals("No reservations found for this apartment");

        done();
      });
  });

  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 10);

  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 15);

  let reservationUser1;
  it("should return an id when posting a valid reservation, test 1", done => {
    chai
      .request(server)
      .post(apartmentEndpoint + apartmentUser1 + "/reservations")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + tokenUser1)
      .send({
        StartDate: startDate,
        EndDate: endDate
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("message").that.is.an("string");
        res.body.should.have
          .property("message")
          .equals("Reservation was succesfully saved");
        res.body.should.have.property("id");

        reservationUser1 = res.body.id;
        done();
      });
  });

  let reservationUser2;
  it("should return an id when posting a valid reservation, test 2", done => {
    chai
      .request(server)
      .post(apartmentEndpoint + apartmentUser1 + "/reservations")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + tokenUser2)
      .send({
        StartDate: startDate,
        EndDate: endDate
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("message").that.is.an("string");
        res.body.should.have
          .property("message")
          .equals("Reservation was succesfully saved");
        res.body.should.have.property("id");

        reservationUser2 = res.body.id;
        done();
      });
  });

  it("should not allow a user to delete a reservation not owned by them", done => {
    chai
      .request(server)
      .delete(
        apartmentEndpoint + apartmentUser1 + "/reservations/" + reservationUser1
      )
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + tokenUser3)
      .send()
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have.property("message").that.is.an("string");
        res.body.should.have
          .property("message")
          .equals("You have no permission to delete this reservation");

        done();
      });
  });

  it("should not allow a user to edit reservations when not owning the apartment/reservation", done => {
    chai
      .request(server)
      .put(
        apartmentEndpoint + apartmentUser1 + "/reservations/" + reservationUser1
      )
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + tokenUser3)
      .send({
        StartDate: startDate,
        EndDate: endDate
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.property("message").that.is.an("string");
        res.body.should.have
          .property("message")
          .equals("No permission to change this data");
        done();
      });
  });

  it("should not allow a user to edit reservations status when not owning the apartment", done => {
    chai
      .request(server)
      .put(
        apartmentEndpoint + apartmentUser1 + "/reservations/" + reservationUser2
      )
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + tokenUser2)
      .send({
        Status: "ACCEPTED"
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.property("message").that.is.an("string");
        res.body.should.have
          .property("message")
          .equals(
            "You have no permission to change the status of this reservation"
          );
        done();
      });
  });

  const newStartDate = new Date();
  newStartDate.setDate(newStartDate.getDate() + 20);

  const newEndDate = new Date();
  newEndDate.setDate(newEndDate.getDate() + 25);
  it("should not allow a user to change reservation dates when not owning the reservation", done => {
    chai
      .request(server)
      .put(
        apartmentEndpoint + apartmentUser1 + "/reservations/" + reservationUser2
      )
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + tokenUser1)
      .send({
        StartDate: newStartDate,
        EndDate: newEndDate
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.property("message").that.is.an("string");
        res.body.should.have
          .property("message")
          .equals("You can only change reservation status");
        done();
      });
  });

  it("should return reservation information when searching for an apartment with a reservation", done => {
    chai
      .request(server)
      .get(apartmentEndpoint + apartmentUser1 + "/reservations")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + tokenUser1)
      .send()
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("result").that.is.an("array");
        res.body.should.have.property("result").ofSize(2);

        const reservation = res.body.result[0];
        assert.equal(
          reservation.ReservationId,
          reservationUser1,
          "reservation should be placed by user 1"
        );
        assert.equal(
          reservation.FirstName,
          "Pieter",
          "reservation should have first name of user 1"
        );
        assert.equal(
          reservation.LastName,
          "Jan",
          "reservation should have first name of user 1"
        );
        assert.equal(
          reservation.Status,
          "INITIAL",
          "reservation should have status INITIAL"
        );

        assert(
          !dateCheck.compare(reservation.StartDate, newStartDate),
          "reservation start date should not be changed to new start date"
        );
        assert(
          !dateCheck.compare(reservation.EndDate, newEndDate),
          "reservation end date should not be changed to end date"
        );
        assert(
          dateCheck.compare(reservation.StartDate, startDate),
          "reservation start date should be the original start date"
        );
        assert(
          dateCheck.compare(reservation.EndDate, endDate),
          "reservation end date should be the original end date"
        );

        done();
      });
  });

  it("should return reservation data when searching with ID", done => {
    chai
      .request(server)
      .get(
        apartmentEndpoint + apartmentUser1 + "/reservations/" + reservationUser1
      )
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + tokenUser1)
      .send()
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("result").that.is.an("array");
        res.body.should.have.property("result").ofSize(1);

        const reservation = res.body.result[0];
        assert.equal(
          reservation.ReservationId,
          reservationUser1,
          "reservation should be placed by user 1"
        );
        assert.equal(
          reservation.FirstName,
          "Pieter",
          "reservation should have first name of user 1"
        );
        assert.equal(
          reservation.LastName,
          "Jan",
          "reservation should have first name of user 1"
        );
        assert.equal(
          reservation.Status,
          "INITIAL",
          "reservation should have status INITIAL"
        );
        assert(
          dateCheck.compare(reservation.StartDate, startDate),
          "reservation start date should be the original start date"
        );
        assert(
          dateCheck.compare(reservation.EndDate, endDate),
          "reservation end date should be the original end date"
        );

        done();
      });
  });

  it("should allow user to change reservation status when owning the apartment", done => {
    chai
      .request(server)
      .put(
        apartmentEndpoint + apartmentUser1 + "/reservations/" + reservationUser2
      )
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + tokenUser1)
      .send({
        Status: "REJECTED"
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("message").that.is.an("string");
        res.body.should.have
          .property("message")
          .equals("Succesfully updated reservation status");
        done();
      });
  });

  it("should return the correct after status is updated", done => {
    chai
      .request(server)
      .get(apartmentEndpoint + apartmentUser1 + "/reservations")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + tokenUser1)
      .send()
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("result").that.is.an("array");
        res.body.should.have.property("result").ofSize(2);

        const reservation = res.body.result[1];
        assert.equal(
          reservation.ReservationId,
          reservationUser2,
          "reservation should be placed by user 2"
        );
        assert.equal(
          reservation.FirstName,
          "Pieter",
          "reservation should have first name of user 2"
        );
        assert.equal(
          reservation.LastName,
          "Jan",
          "reservation should have first name of user 2"
        );
        assert.equal(
          reservation.Status,
          "REJECTED",
          "reservation status should have changed to REJECTED"
        );
        assert(
          dateCheck.compare(reservation.StartDate, startDate),
          "reservation start date should be the original start date"
        );
        assert(
          dateCheck.compare(reservation.EndDate, endDate),
          "reservation end date should be the original end date"
        );

        done();
      });
  });

  it("should allow user to change reservation dates if they placed the reservation", done => {
    chai
      .request(server)
      .put(
        apartmentEndpoint + apartmentUser1 + "/reservations/" + reservationUser2
      )
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + tokenUser2)
      .send({
        StartDate: newStartDate,
        EndDate: newEndDate
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("message").that.is.an("string");
        res.body.should.have
          .property("message")
          .equals("Succesfully updated reservation dates");
        done();
      });
  });

  it("should return the correct dates and status after dates are updated", done => {
    chai
      .request(server)
      .get(apartmentEndpoint + apartmentUser1 + "/reservations")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + tokenUser1)
      .send()
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("result").that.is.an("array");
        res.body.should.have.property("result").ofSize(2);

        const reservation = res.body.result[1];
        assert.equal(
          reservation.ReservationId,
          reservationUser2,
          "reservation should be placed by user 2"
        );
        assert.equal(
          reservation.FirstName,
          "Pieter",
          "reservation should have first name of user 2"
        );
        assert.equal(
          reservation.LastName,
          "Jan",
          "reservation should have first name of user 2"
        );
        assert.equal(
          reservation.Status,
          "INITIAL",
          "reservation status should have changed back to INITIAL"
        );
        assert(
          dateCheck.compare(reservation.StartDate, newStartDate),
          "reservation start date should be the updated start date"
        );
        assert(
          dateCheck.compare(reservation.EndDate, newEndDate),
          "reservation end date should be the updated end date"
        );

        done();
      });
  });

  it("should allow a user to delete their reservation", done => {
    chai
      .request(server)
      .delete(
        apartmentEndpoint + apartmentUser1 + "/reservations/" + reservationUser2
      )
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + tokenUser2)
      .send()
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message").that.is.an("string");
        res.body.should.have
          .property("message")
          .equals("Reservation was succesfully deleted");

        done();
      });
  });

  it("should return the correct number of reservations after deleting one", done => {
    chai
      .request(server)
      .get(apartmentEndpoint + apartmentUser1 + "/reservations")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + tokenUser1)
      .send()
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("result").that.is.an("array");
        res.body.should.have.property("result").ofSize(1);

        const reservation = res.body.result[0];
        assert.equal(
          reservation.ReservationId,
          reservationUser1,
          "reservation should be placed by user 1"
        );
        assert.equal(
          reservation.FirstName,
          "Pieter",
          "reservation should have first name of user 1"
        );
        assert.equal(
          reservation.LastName,
          "Jan",
          "reservation should have first name of user 1"
        );
        assert.equal(
          reservation.Status,
          "INITIAL",
          "reservation status should have changed back to INITIAL"
        );
        assert(
          dateCheck.compare(reservation.StartDate, startDate),
          "reservation start date should be the original start date"
        );
        assert(
          dateCheck.compare(reservation.EndDate, endDate),
          "reservation end date should be the original end date"
        );

        done();
      });
  });

  it("should allow a user to delete their reservation", done => {
    chai
      .request(server)
      .delete(
        apartmentEndpoint + apartmentUser1 + "/reservations/" + reservationUser1
      )
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + tokenUser1)
      .send()
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message").that.is.an("string");
        res.body.should.have
          .property("message")
          .equals("Reservation was succesfully deleted");

        done();
      });
  });

  // Use test to clean up test case apartment
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

  it("should return an error when searching for reservations for non-existent apartments", done => {
    chai
      .request(server)
      .get(apartmentEndpoint + apartmentUser1 + "/reservations")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + tokenUser1)
      .send()
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have.property("message").that.is.an("string");
        res.body.should.have
          .property("message")
          .equals("No apartment found for this ID");

        done();
      });
  });

  it("should return an error when searching for reservation id for non-existent apartments", done => {
    chai
      .request(server)
      .get(
        apartmentEndpoint + apartmentUser1 + "/reservations/" + reservationUser1
      )
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + tokenUser1)
      .send()
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have.property("message").that.is.an("string");
        res.body.should.have
          .property("message")
          .equals("No reservation found for this ID");

        done();
      });
  });

  it("should return an error when posting a reservation to a non-existent apartment", done => {
    chai
      .request(server)
      .post(apartmentEndpoint + apartmentUser1 + "/reservations")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + tokenUser1)
      .send({
        StartDate: startDate,
        EndDate: endDate
      })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property("message").that.is.an("string");
        res.body.should.have
          .property("message")
          .equals("No apartment found with this ID");
        done();
      });
  });

  it("should return an error when editting a non-existent reservation", done => {
    chai
      .request(server)
      .put(
        apartmentEndpoint + apartmentUser1 + "/reservations/" + reservationUser2
      )
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + tokenUser2)
      .send({
        StartDate: startDate,
        EndDate: endDate
      })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property("message").that.is.an("string");
        res.body.should.have
          .property("message")
          .equals("No apartment found with this ID");
        done();
      });
  });

  it("should return an error when deleting a non-existent reservation", done => {
    chai
      .request(server)
      .delete(
        apartmentEndpoint + apartmentUser1 + "/reservations/" + reservationUser2
      )
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + tokenUser2)
      .send()
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property("message").that.is.an("string");
        res.body.should.have
          .property("message")
          .equals("No reservation found to delete");
        done();
      });
  });
});
