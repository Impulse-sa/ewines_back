const { Router } = require('express')
const router = Router()

const { Favorite } = require('../db')
const { v4: uuidv4 } = require('uuid')

router.get('/:id', async (req, res) => {
  const { id } = req.params

  const results = []
  try {
    const favorites = await Favorite.findAll({
      where: {
        userId: id
      }
    })

    favorites.forEach(r => {
      results.push(r.id)
    })

    res.status(200).json(results)
  } catch (error) {
    res.status(404).json(`Error tratando de obtener los favoritos del usuario con el id: ${id}`)
  }
})

router.post('/', async (req, res) => {
  const { userId, productId } = req.body

  try {
    const favoriteCreated = await Favorite.create({
      id: uuidv4(),
      userId,
      productId
    })

    res.status(201).json(favoriteCreated)
  } catch (error) {
    res.status(400).json(`Error creando publicacion favorita para el usuario con el id: ${userId}`)
  }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const favoriteDeleted = await Favorite.destroy({
      where: {
        id
      }
    })
    return favoriteDeleted
  } catch (error) {
    throw new Error('Error al eliminar el usuario!')
  }
}

)

module.exports = router
