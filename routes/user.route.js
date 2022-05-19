const router = require('express').Router()
const User = require('../models/user.model')
const { role } = require('../config')

const response = require('../utils/response')
const CustomError = require('../utils/custom-error')

const auth = require('../middlewares/auth.middleware')

router.get("/me", auth(role.USER), async (req, res) => {
    // Get user
    const user = await User.findById(req.$user._id)
    if(!user) throw new CustomError("unauthorized access: User does not exist", 401)

    // Send response
    res.status(200).json(response('User found', user, true))
})

module.exports = router