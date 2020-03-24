const express = require('express');
const router  = express.Router();

const apartmentController = require('../controllers/apartment.controller');
const reservationController = require('../controllers/reservation.controller');
const authController = require('../controllers/authentication.controller');

router.post('/', authController.validateToken, apartmentController.createApartment);
router.get('/',  authController.validateToken, apartmentController.getAllApartments);
router.get('/:apartmentID', authController.validateToken, apartmentController.getApartmentById);
router.put('/:apartmentID', authController.validateToken, apartmentController.updateApartment);
router.delete('/:apartmentID', authController.validateToken, apartmentController.deleteApartment);

router.post('/:apartmentID/reservations', authController.validateToken, reservationController.createReservation);
router.get('/:apartmentID/reservations', authController.validateToken,  reservationController.getAllReservations);
router.get('/:apartmentID/reservations/:reservationID', authController.validateToken, reservationController.getReservationById);
router.put('/:apartmentID/reservations/:reservationID', authController.validateToken, reservationController.updateReservation);
router.delete('/:apartmentID/reservations/:reservationID', authController.validateToken, reservationController.deleteReservation);

module.exports = router;


