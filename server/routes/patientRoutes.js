const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {createPatient, getAllPatients, updatePatient, getPatientById} = require('../controllers/patientController');

router.post('/add-patient',auth,createPatient);
router.get('/all-patients',auth,getAllPatients);
router.get('/:id',auth,getPatientById);
router.put("/:id",auth,updatePatient);

module.exports = router;
