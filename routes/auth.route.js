const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const { JWT_SECRET } = require('../config')

const response = require('../utils/response')
const CustomError = require('../utils/custom-error')

router.post('/register', async (req, res) => {
    // Check if all fields are filled
    if(!req.body.name) throw new CustomError('name is required', 400)
    if(!req.body.email) throw new CustomError('email is required', 400)
    if(!req.body.password) throw new CustomError('password is required', 400)

    // Get user from database
    const user = await User.findOne({ email: req.body.email })
    if(user) throw new CustomError('User already exists', 400)

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    // Create user
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        role: 'admin'
    })

    // Save user to database
    const savedUser = await newUser.save()

    res.status(200).json(response('User created successfully', savedUser, true))
})

router.post('/login', async (req, res) => {
    // Check if all fields are filled
    if(!req.body.email) throw new CustomError('email is required', 400)
    if(!req.body.password) throw new CustomError('password is required', 400)

    // Get user from database
    const user = await User.findOne({ email: req.body.email })
    if(!user) throw new CustomError('User does not exist', 400)

    // Check if password is correct
    const isMatch = await bcrypt.compare(req.body.password, user.password)
    if(!isMatch) throw new CustomError('Incorrect password', 400)

    // Create and assign token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET)

    res.status(200).json(response('Login successful', { token, user }, true))
})
    
module.exports = router