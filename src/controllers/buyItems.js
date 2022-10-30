const { BuyItem, Publication, Product } = require('../db')

const getAllBuyItems = async () => {
  const resultParsed = []
  try {
    const dbResult = await BuyItem.findAll()
    console.log(dbResult)
    dbResult?.forEach(b => {
      resultParsed.push({
        buyItemId: b.dataValues.id,
        countProducts: b.dataValues.countProduct,
        publicationId: b.dataValues.publicationId,
        buyId: b.dataValues.buyId
      })
    })
    console.log('resultados parseados', resultParsed)

    return resultParsed
  } catch (error) {
    return new Error(error.message)
  }
}

const getAllBuyItemsOfBuy = async (buyId) => {
  const resultParsed = []
  try {
    const dbResult = await BuyItem.findAll({
      include: {
        model: Publication,
        include: Product
      },
      where: {
        buyId
      }
    })
    console.log(dbResult)
    dbResult?.forEach(b => {
      resultParsed.push({
        buyItemId: b.dataValues.id,
        countProducts: b.dataValues.countProduct,
        publicationId: b.dataValues.publicationId,
        buyId: b.dataValues.buyId,
        title: b.dataValues.publication.title,
        price: b.dataValues.publication.price,
        image: b.dataValues.publication.image,
        description: b.dataValues.publication.description,
        name: b.dataValues.publication.product.name,
        type: b.dataValues.publication.product.type,
        varietal: b.dataValues.publication.product.varietal,
        img: b.dataValues.publication.product.img,
        bodega: b.dataValues.publication.product.bodega
      })
    })
    console.log('resultados parseados', resultParsed)

    return dbResult
  } catch (error) {
    return new Error(error.message)
  }
}
module.exports = {
  getAllBuyItems,
  getAllBuyItemsOfBuy
}
