const { Router } = require('express')
const router = Router()

const { Conversation, User } = require('../db')

router.post('/', async (req, res) => {
  const { member1, member2 } = req.body

  try {
    const newConversation = await Conversation.create()
    if (newConversation) {
      await newConversation.addUser(member1)
      await newConversation.addUser(member2)
    }
    res.status(201).json(newConversation)
  } catch (error) {
    res.status(400).json('Error tratando de crear una nueva conversacion!')
  }
})

router.get('/user/:id', async (req, res) => {
  const { id } = req.params
  const results = []
  try {
    const conversations = await Conversation.findAll({
      include: User
    })

    conversations.forEach(c => {
      for (let x = 0; x < c.users.length; x++) {
        console.log(c.users[x].id)
        if (c.users[x].id === id) {
          results.push(c)
        }
      }
    })

    if (!results.length) return res.status(404).json(`No se han encontrado conversaciones para el usuario con el id: ${id}`)

    res.status(200).json(results)
  } catch (error) {
    res.status(400).json(`Error tratando de obtener las conversacion del usuario con el id: ${id}`)
  }
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const conversation = await Conversation.findByPk(id, {
      include: User
    })

    res.status(200).json(conversation)
  } catch (error) {
    res.status(400).json(`Error tratando de obtener la conversacion con el id: ${id}`)
  }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    await Conversation.destroy({
      where: {
        id
      }
    })
    res.status(204).json('Conversacion eliminada')
  } catch (error) {
    res.status(400).json('Error tratando de eliminar una conversacion')
  }
})

module.exports = router
