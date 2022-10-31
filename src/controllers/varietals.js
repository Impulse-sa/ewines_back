const { Varietal } = require('../db')

const varietales = ['Ancellotta', 'Blend', 'Cabernet Franc', 'Cabernet Sauvignon', 'Chardonnay', 'Chenin Blanc', 'Malbec', 'Malbec Rose', 'Sangiovese', 'Merlot', 'Pinot Noir', 'Petit Verdot', 'Sauvignon Blanc', 'Semillon', 'Syrah', 'Tannat', 'Tempranillo', 'Torrontés', 'Viognier']

const getAllVarietals = async () => {
  const resultParsed = []
  try {
    const dbResult = await Varietal.findAll()
    dbResult?.forEach(v => {
      resultParsed.push(
        v.dataValues.name
      )
    })

    if (!resultParsed.length) {
      varietales.forEach(async (varietal) => {
        const aux = await Varietal.create({ name: varietal, description: '' })
        resultParsed.push(aux.name)
      })
    }
    return resultParsed.sort((a, b) => {
      if (a > b) return 1
      if (a < b) return -1
      return 0
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

const createVarietal = async (name, description) => {
  try {
    const resultParsed = []
    const varietalCreated = await Varietal.create({ name, description })

    if (varietalCreated) {
      const dbResult = await Varietal.findAll()
      dbResult?.forEach(v => {
        resultParsed.push(
          v.dataValues.name
        )
      })
    }
    return resultParsed.sort((a, b) => {
      if (a > b) return 1
      if (a < b) return -1
      return 0
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

const updateVarietal = async (id, name, description) => {
  try {
    const dbResult = await Varietal.update(
      {
        name,
        description
      },
      {
        where: {
          id
        }
      })
    return dbResult
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = {
  getAllVarietals,
  createVarietal,
  updateVarietal
}
