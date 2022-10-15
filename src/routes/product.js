const { Product } = require('../db')
const server = require('express').Router()
const productController = require('../controllers/products')

server.get('/', async (req, res) => {
  try {
    const productsFromDb = await productController.getAllProducts()

    if (!productsFromDb.length) return res.status(404).json('No hay productos guardados en la Base de Datos!')

    return res.status(200).json(productsFromDb)
  } catch (error) {
    res.status(400).json(error.message)
  }
})
// Busca el producto por ID y devulve el Producto
server.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const productById = await productController.getProductById(id)

    if (!productById) return res.status(404).json(`Producto con el ID: ${id} no encontrado!`)

    return res.status(200).json(productById)
  } catch (error) {
    res.status(400).json(error.message)
  }
})
// crear producto
server.post('/', async (req, res) => {
  const { name, type, varietal, origin, img, cellar } = req.body

  if (!name) return res.status(400).json('Falta parametro nombre!')
  if (!type) return res.status(400).json('Falta parametro tipo!')
  if (!varietal) return res.status(400).json('Falta parametro varietal!')
  if (!origin) return res.status(400).json('Falta parametro origin!')
  if (!img) return res.status(400).json('Falta parametro img!')
  if (!cellar) return res.status(400).json('Falta parametro cellar!')

  try {
    const productExist = await Product.findOne({
      where: {
        name
      }
    })

    if (productExist) return res.status(404).json('Ya existe un vino con ese nombre. Prueba con uno nuevo!')

    const productCreated = await productController.createProduct(
      name, type, varietal, origin, img, cellar
    )

    res.status(201).json(productCreated)
  } catch (error) {
    res.status(400).json(error.message)
  }
})

module.exports = server
