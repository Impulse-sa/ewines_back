const { Router } = require('express')
const router = Router()

const { v4: uuidv4 } = require('uuid')

const { User } = require('../db')

const userController = require('../controllers/users')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
// const auth = require('../config/auth')

const nodemailer = require('nodemailer')
const fs = require('fs')
const { promisify } = require('util')
const readFile = promisify(fs.readFile)

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587, // port for secure SMTP
  auth: {
    user: 'e.winemarketplace@gmail.com',
    pass: 'yrzjdsfbehvmxtvt'
  }
})

router.post('/forgotPassword', async (req, res) => {
  const { email } = req.body

  try {
    const emailExist = await User.findOne({
      where: {
        email
      }
    })

    if (!emailExist) {
      return res
        .status(400)
        .json('No existe un usuario con esa direccion de email!')
    }

    const newPassword = uuidv4()

    const userUpdated = await User.update(
      {
        password: await bcrypt.hash(newPassword, 10)
      },
      {
        where: {
          email
        }
      }
    )

    const mailOptions = {
      from: 'e.winemarketplace@gmail.com',
      to: email,
      subject: 'Password Provisorio',
      html: `<div>
      <h1 style="color: white; text-align: center; text-transform: uppercase; background-color: #56070C; font-size: 20px;">Nuevo Password Provisorio!</h1>
      <h2 style="font-size: 16px; text-align: center;">Password</h2>
      <h2 style="font-size: 16px; text-align: center;">${newPassword}</h2>
       <div style="text-align: center;">
        <img src="e-wine.png" alt="img" />   
       </div>
        <a style="background-color: #56070C; padding: 4px 8px; color: white; border-radius: 5px; width: 150; text-decoration: none; text-align: center;" href="http://localhost:3000/home">Ir a E-Wines</a>
    </div>`,
      attachments: [
        {
          filename: 'e-wine.png',
          path: './e-wine.png'
        }
      ]
    }

    await transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent: ' + info.response)
      }
    })

    res.status(201).json(userUpdated)
  } catch (error) {
    res.status(400).json(error.message)
  }
})

router.get('/filter/:id', async (req, res) => {
  const { id } = req.params

  try {
    let usersFromDb = await userController.getAllUsers()

    if (!usersFromDb.length) {
      return res.status(200).json('No hay usuarios guardados en la Base de Datos!')
    }

    usersFromDb = usersFromDb.filter(user => user.id !== id && user.isSommelier === true)

    return res.status(200).json(usersFromDb)
  } catch (error) {
    res.status(400).json(error.message)
  }
})

router.get('/provinces', async (req, res) => {
  try {
    const usersFromDb = await userController.getAllUsers()

    if (!usersFromDb.length) {
      return res.status(200).json('No hay usuarios guardados en la Base de Datos!')
    }

    const provinces = {
      'Buenos Aires': 0,
      Catamarca: 0,
      Chaco: 0,
      Chubut: 0,
      Córdoba: 0,
      Corrientes: 0,
      'Entre Ríos': 0,
      Formosa: 0,
      Jujuy: 0,
      'La Pampa': 0,
      'La Rioja': 0,
      Mendoza: 0,
      Misiones: 0,
      Neuquén: 0,
      'Río Negro': 0,
      Salta: 0,
      'San Juan': 0,
      'San Luis': 0,
      'Santa Cruz': 0,
      'Santa Fe': 0,
      'Santiago del Estero': 0,
      'Tierra del Fuego': 0,
      Tucumán: 0
    }

    for (let x = 0; x < usersFromDb.length; x++) {
      let region

      if (usersFromDb[x].region !== 'null' && usersFromDb[x].region !== null) {
        region = usersFromDb[x].region
        provinces[region] = provinces[region] + 1
      }
    }

    return res.status(200).json(provinces)
  } catch (error) {
    res.status(400).json(error.message)
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const userEmail = await User.findOne({ where: { email } })
    if (userEmail.isBanned) throw new Error('Usuario baneado!')
    if (!userEmail) throw new Error('Email no encontrado!')

    const passwordMatch = await bcrypt.compare(password, userEmail.password)
    if (!passwordMatch) throw new Error('Password es incorrecto')

    const userById = await userController.getUserById(userEmail.id)
    const token = jwt.sign({
      userId: userById.id,
      email: userById.email,
      username: userById.username
    }, 'RANDOM_TOKEN', { expiresIn: '24h' })

    res.status(200).json({ user: userById, token })
  } catch (error) {
    res.status(400).json(error.message)
  }
})

router.get('/email/:email', async (req, res) => {
  const { email } = req.params

  try {
    const findEmail = await User.findOne({
      where: {
        email
      }
    })

    if (findEmail) {
      return res.status(404).json(true)
    }

    res.status(200).json(false)
  } catch (error) {
    res.status(400).json(error.message)
  }
})

router.get('/username/:username', async (req, res) => {
  const { username } = req.params

  try {
    const findUsername = await User.findOne(
      { where: { username } }
    )

    if (findUsername) {
      return res.status(404).json(true)
    }

    res.status(200).json(false)
  } catch (error) {
    res.status(400).json(error.message)
  }
})

router.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const userById = await userController.getUserById(id)

    if (!userById) {
      return res.status(200).json(`Usuario con ID: ${id} no encontrado!`)
    }
    res.status(200).json(userById)
  } catch (error) {
    res.status(400).json(error.message)
  }
})

router.get('/banned/true', async (req, res) => {
  try {
    const usersFromDb = await userController.getAllUsersBanned()

    if (!usersFromDb.length) {
      return res.status(404).json('No hay usuarios guardados en la Base de Datos!')
    }

    return res.status(200).json(usersFromDb)
  } catch (error) {
    res.status(400).json(error.message)
  }
})

router.get('/banned/false', async (req, res) => {
  try {
    const usersFromDb = await userController.getAllUsersNotBanned()

    if (!usersFromDb.length) {
      return res.status(404).json('No hay usuarios guardados en la Base de Datos!')
    }

    return res.status(200).json(usersFromDb)
  } catch (error) {
    res.status(400).json(error.message)
  }
})

router.get('/', async (req, res) => {
  try {
    const usersFromDb = await userController.getAllUsers()

    if (!usersFromDb.length) {
      return res.status(200).json('No hay usuarios guardados en la Base de Datos!')
    }

    return res.status(200).json(usersFromDb)
  } catch (error) {
    res.status(400).json(error.message)
  }
})

router.post('/', async (req, res) => {
  const { username, email, password, region } = req.body

  if (!username) return res.status(404).json('Falta nombre de usuario!')
  if (!email) return res.status(404).json('Falta email de usuario!')
  if (!password) return res.status(404).json('Falta password!')
  if (!region) return res.status(404).json('Falta parametro region!')

  try {
    const emailExist = await User.findOne({
      where: {
        email
      }
    })

    if (emailExist) {
      return res
        .status(400)
        .json('Existe un usuario con esa direccion de email. Prueba con una nueva!')
    }

    const usernameExist = await User.findOne({
      where: {
        username
      }
    })

    if (usernameExist) {
      return res
        .status(400)
        .json('Existe un usuario con ese username. Pruebe con una nuevo!')
    }

    const userCreated = await userController.createUser(
      username,
      email,
      password,
      region
    )

    const mailOptions = {
      from: 'e.winemarketplace@gmail.com',
      to: email,
      subject: 'Creaste tu cuenta en E-Wines',
      html: await readFile('./message.html', 'utf-8'),
      attachments: [
        {
          filename: 'e-wine.png',
          path: './e-wine.png'
        }
      ]
    }

    await transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent: ' + info.response)
      }
    })

    res.status(201).json(userCreated)
  } catch (error) {
    res.status(400).json(error.message)
  }
})

router.put('/:id/image-upload', async (req, res) => {
  const { id } = req.params
  const { url } = req.body

  try {
    const result = await userController.setImage(id, url)
    return res.status(200).json(result)
  } catch (error) {
    res.status(400).json('Error tratando de subir la imagen de usuario')
  }
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { banned, sommelier, verified, admin } = req.query

  try {
    if (verified) {
      const result = await userController.setVerified(id, banned)
      return res.status(200).json(result)
    }
    if (banned) {
      const result = await userController.setBanned(id, banned)
      return res.status(200).json(result)
    }
    if (sommelier) {
      const result = await userController.setSommelier(id, sommelier)
      return res.status(200).json(result)
    }
    if (admin) {
      const result = await userController.setAdmin(id, admin)
      return res.status(200).json(result)
    }

    const { password, password2 } = req.body

    const result = await userController.setPassword(id, password, password2)
    return res.status(200).json(result)
  } catch (error) {
    res.status(400).json(error.message)
  }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const result = await userController.deleteUserById(id)
    res.status(200).json(result)
  } catch (error) {
    res.status(400).json(error.message)
  }
})

module.exports = router
