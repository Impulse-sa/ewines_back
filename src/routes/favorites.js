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
      results.push({
        id: r.id,
        publicationId: r.publicationId,
        userId: r.userId
      })
    })

    res.status(200).json(results)
  } catch (error) {
    /* res.status(400).json(`Error tratando de obtener los favoritos del usuario con el id: ${id}`) */
    res.status(400).json(error.message)
  }
})

router.post('/', async (req, res) => {
  const { userId, publicationId } = req.body

  try {
    const favoriteCreated = await Favorite.create({
      id: uuidv4(),
      userId,
      publicationId
    })

    if (favoriteCreated) {
      const results = []
      const favorites = await Favorite.findAll()

      favorites.forEach(r => {
        results.push(r.id)
      })
      res.status(200).json(favorites)
    }
  } catch (error) {
    /* res.status(400).json(`Error creando publicacion favorita para el usuario con el id: ${userId}`) */
    res.status(400).json(error.message)
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
    if (favoriteDeleted) {
      const results = []
      const favorites = await Favorite.findAll()

      favorites.forEach(r => {
        results.push(r.id)
      })
      res.status(200).json(favorites)
    }
  } catch (error) {
    throw new Error('Error al eliminar el usuario!')
  }
}

)

module.exports = router
