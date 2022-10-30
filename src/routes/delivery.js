const { Router } = require('express')
const router = Router()

const { Delivery, BuyItem, Publication, User, Buy } = require('../db')

router.post('/', async (req, res) => {
  const { status, buyId } = req.body

  try {
    const delivery = await Delivery.create({
      status,
      buyId
    })

    res.status(201).json(delivery)
  } catch (error) {
    res.status(400).json(error.message)
  }
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  try {
    const deliveryUpdated = await Delivery.update(
      {
        status
      },
      {
        where: {
          id
        }
      }
    )
    if (deliveryUpdated) {
      const buysId = []
      const buyItems = await BuyItem.findAll({
        include: {
          model: Publication,
          where: {
            userId: id
          }
        }
      })

      buyItems.forEach(item => {
        buysId.push(item.dataValues.buyId)
      })

      const resultParsed = []
      buyItems.forEach(async (item) => {
        const b = await Buy.findByPk(item.dataValues.buyId, {
          include:
          [{
            model: Delivery
          }, {
            model: User
          }]
        })
        resultParsed.push({
          buyId: b.dataValues.id,
          currency: b.dataValues.currency,
          paymentMethod: b.dataValues.paymentMethod,
          totalAmount: b.dataValues.totalAmount,
          userId: b.dataValues.userId,
          createdAt: b.dataValues.createdAt,
          username: b.dataValues.user.username,
          status: b.dataValues.delivery.status,
          deliveryId: b.dataValues.delivery.id
        })
      })
      setTimeout(() => {
        res.status(200).json(resultParsed)
      }, 200)
    }
  } catch (error) {
    res.status(400).json(error.message)
  }
})

module.exports = router
