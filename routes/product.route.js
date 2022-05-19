const router = require('express').Router()
const Product = require('../models/product.model')
const { role } = require('../config')

const response = require('../utils/response')
const CustomError = require('../utils/custom-error')

const auth = require('../middlewares/auth.middleware')

// Create a new product
router.post('/', auth(role.ADMIN), async (req, res) => {
    // Check for required fields
    if(!req.body.name) throw new CustomError("name is required", 400)
    if(!req.body.description) throw new CustomError("description is required", 400)
    if(!req.body.price) throw new CustomError("price is required", 400)
    if(!req.body.category) throw new CustomError("category is required", 400)

    // Create product
    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        user: req.$user._id
    })

    await product.save()
    
    res.status(200).json(response("Product created successfully", product, true))
})

// Get all products
router.get('/all', async (req, res) => {
    const products = await Product.find({})

    res.status(200).json(response("Products found successfully", products, true))
})

// Find By Multiple Categories
router.get('/category', async (req, res) => {
    var categories = req.query.categories?.split(',')
    if(!categories || categories.includes("")) categories = await Product.find({}).distinct('category')

    const products = await Product.find({ category: { $in: categories } })

    res.status(200).json(response("Products found successfully", products, true))
})

// Find By Price Range
router.get('/price', async (req, res) => { 
    // define price range  
    const min = req.query.min || 0
    const max = req.query.max || Number.MAX_SAFE_INTEGER

    const products = await Product.find({ price: { $gte: min, $lte: max } }) 

    res.status(200).json(response("Products found successfully", products, true))
})

// Find By Name
router.get('/name/', async (req, res) => {
    const name = req.query.name || ""
    const products = await Product.find({ name: { $regex: name, $options: 'i' } })

    res.status(200).json(response("Products found successfully", products, true))
})

// Find By multiple parameters
router.get('/search/', async (req, res) => {
    var categories = req.query.categories?.split(',')
    if(!categories || categories.includes("")) categories = await Product.find({}).distinct('category')

    const min = req.query.min || 0
    const max = req.query.max || Number.MAX_SAFE_INTEGER

    const name = req.query.name || ""

    // Sort dynamicly
    var sortBy = undefined
    var sortOrder = req.query.sortOrder || -1
    
    if(req.query.sortBy) {
        sortBy = req.query.sortBy
    }

    const products = await Product
    .find({
        category: { $in: categories },
        price: { $gte: min, $lte: max },
        name: { $regex: name, $options: 'i' }
    })
    .sort({ 
        [sortBy]: sortOrder 
    })

    res.status(200).json(response("Products found successfully", products, true))
})

// Find By Id
router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id)

    if(!product) throw new CustomError("Product not found", 404)
})

module.exports = router