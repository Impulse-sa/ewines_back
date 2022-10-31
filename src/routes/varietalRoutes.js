const { Router } = require('express')
const { getAllVarietals, createVarietal, updateVarietal } = require('../controllers/varietals')
const { Varietal } = require('../db')
const router = Router()

router.get('/:name', async (req, res) => {
  try {
    const { name } = req.params

    const varietal = await Varietal.findOne({
      where: {
        name
      }
    })

    if (varietal) return res.status(200).json(true)

    res.status(200).json(false)
  } catch (error) {
    res.status(400).json(error.message)
  }
})

router.get('/', async (req, res) => {
  try {
    const allVarietals = await getAllVarietals()

    res.status(200).json(allVarietals)
  } catch (error) {
    res.status(400).json(error.message)
  }
})

router.post('/', async (req, res) => {
  const { name, description } = req.body
  try {
    const newVarietal = await createVarietal(name, description)
    res.status(200).json(newVarietal)
  } catch (error) {
    res.status(400).json(error.message)
  }
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { name, description } = req.body
  try {
    const newVarietal = await updateVarietal(id, name, description)
    res.status(200).json(newVarietal)
  } catch (error) {
    res.status(400).json(error.message)
  }
})

module.exports = router
