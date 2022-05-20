const router = require('express').Router()
const Patient = require('../models/patient.model')

const { role } = require('../config')
const response = require('../utils/response')
const CustomError = require('../utils/custom-error')

const auth = require('../middlewares/auth.middleware')
const upload = require("./../middlewares/multer.middleware");

// Create a patient
router.post('/', auth(role.ADMIN), upload("image"), async (req, res) => {
    // Check for required fields
    if(!req.body.hospitalNumber) throw new CustomError("Hospital number is required")
    if(!req.body.occupation) throw new CustomError("Occupation is required")
    if(!req.body.surname) throw new CustomError("Surname is required")
    if(!req.body.otherNames) throw new CustomError("Other names is required")
    if(!req.body.phoneNumber) throw new CustomError("Phone number is required")
    if(!req.body.dateOfBirth) throw new CustomError("Date of birth is required")
    if(!req.body.dateAdmitted) throw new CustomError("Date admitted is required")
    if(!req.body.age) throw new CustomError("Age is required")
    if(!req.body.address) throw new CustomError("Address is required")
    if(!req.body.ward) throw new CustomError("Ward is required")
    if(!req.body.sex) throw new CustomError("Sex is required")
    if(!req.body.maritalStatus) throw new CustomError("Marital Status is required")
    if(!req.body.consultant) throw new CustomError("Consultant Status is required")
    if(!req.body.diagnosis) throw new CustomError("Diagnosis Status is required")

    // Save patient
    const newPatient = new Patient(req.body)

    const savedPatient = await newPatient.save()

    res.status(200).json(response('User created successfully', savedPatient, true))
})

// Search for a patient
router.get('/search', async (req, res) => {
    const { search } = req.query
    
    const patients = await Patient.find({
        $or: [
            { hospitalNumber: parseInt(search) || 0 },
            { surname: { $regex: search, $options: 'i' } },
            { otherNames: { $regex: search, $options: 'i' } },
            { phoneNumber: { $regex: search, $options: 'i' } },
            { ward: parseInt(search) || 0 },
        ]
    })
    console.log(patients, "q")

    res.status(200).json(response('Patients found', patients, true))
})

// Get a patient
router.get('/:id', async (req, res) => {
    const patient = await Patient.findById(req.params.id)
    if(!patient) throw new CustomError("Patient not found", 404)

    res.status(200).json(response('Patient found', patient, true))
})

// Update a Patient
router.put('/:id', auth(role.ADMIN), upload("image"), async (req, res) => {
    const id = req.params.id

    // find patient by id
    const patient = await Patient.findById(id)
    if(!patient) throw new CustomError("Patient not found", 404)

    // Update patient by id
    const updatedPatient = await Patient.findByIdAndUpdate(id, { $set: req.body }, { new: true })

    res.status(200).json(response('Patient updated successfully', updatedPatient, true))
})

// Delete a patient
router.delete('/:id', auth(role.ADMIN), async (req, res) => {
    const id = req.params.id

    // find patient by id
    const patient = await Patient.findById(id)
    if(!patient) throw new CustomError("Patient not found", 404)

    // Delete patient by id
    const deletedPatient = await Patient.findByIdAndDelete(id)

    res.status(200).json(response('Patient deleted successfully', deletedPatient, true))
})

module.exports = router