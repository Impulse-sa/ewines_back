const { Router } = require('express')

// ALL ROUTES
const productRouter = require('./product.js')
const userRouter = require('./users')
const publicationRoutes = require('./publicationRoutes.js')
const githubRouter = require('./github.js')
const router = Router()

// LOAD EACH ROUTES IN A ROUTE
router.get('/', (req, res) => {
  res.status(200).json([])
})
router.use('/products', productRouter)
router.use('/users', userRouter)
router.use('/publications', publicationRoutes)
router.use('/github', githubRouter)

module.exports = router
