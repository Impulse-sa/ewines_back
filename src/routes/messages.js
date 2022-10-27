const { Router } = require('express')
const router = Router()

const { Message } = require('../db')

router.post('/', async (req, res) => {
  const { userId, conversationId, text } = req.body

  try {
    const newMessage = await Message.create({
      userId,
      conversationId,
      text
    })
    res.status(201).json(newMessage)
  } catch (error) {
    res.status(400).json(error.message)
    /* res.status(400).json('Error tratando de publicar un mensaje') */
  }
})

router.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const messages = await Message.findAll({
      where: {
        conversationId: id
      },
      order: [['createdAt', 'ASC']]
    })
    res.status(200).json(messages)
  } catch (error) {
    res.status(400).json(error.message)
  }
})

module.exports = router
