const express = require("express");
const router = express.Router();
const {createPatient, getAllPatients, updatePatient, getPatientById} = require('../controllers/patientController');

router.post('/add-patient',createPatient);
router.get('/all-patients',getAllPatients);
router.get('/:id',getPatientById);
router.put("/:id", updatePatient);

module.exports = router;
