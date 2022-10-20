const { Router } = require('express')
const router = Router()

const { User } = require('../db')

const userController = require('../controllers/users')

/* const { v4: uuid4 } = require('uuid') */

const passport = require('passport')

/* const nodemailer = require('nodemailer') */
/* const fs = require('fs')
const { promisify } = require('util')
const readFile = promisify(fs.readFile) */

/* const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587, // port for secure SMTP
  auth: {
    user: 'e.winemarketplace@gmail.com',
    pass: 'yrzjdsfbehvmxtvt'
  }
}) */

/* router.get('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const userEmail = await User.findOne({ where: { email } })

    if (!userEmail) return res.status(404).json('Email no encontrado!')
    if (userEmail.password !== password) return res.status(404).json('Password es incorrecto')

    const userById = await userController.getUserById(userEmail.id)
    res.status(200).json(userById)
  } catch (error) {
    res.status(400).json(error.message)
  }
}) */

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) throw err
    if (!user) return res.status(200).json('Usuario no existe!')
    req.logIn(user, (err) => {
      if (err) throw err
      return res.status(200).json(user)
    })
  })(req, res, next)
})

router.get('/logout', async (req, res, next) => {
  /*  await req.session.destroy(function (err) {
    if (err) return next(err);
  }); */
  await req.logOut(function (err) {
    if (err) return next(err)
  })
  res.clearCookie('e-wine')
  res.send(false)

  /* req.logout(function (err) {
    if (err) return next(err);
    res.send(false);
  }); */
})

router.get('/user', (req, res) => {
  console.log(req.user)
  if (req.user) return res.send(req.user)
  // store the entire user that has been authenticated
  else res.send(false)
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
      return res.status(404).json('El email ya existe!')
    }

    res.status(200).json('El email esta disponible!')
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
      return res.status(404).json('El username ya existe. Pruebe con otro!')
    }

    res.status(200).json('El username esta disponible!')
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

  if (!username) return res.status(200).json('Falta nombre de usuario!')
  if (!email) return res.status(200).json('Falta email de usuario!')
  if (!password) return res.status(200).json('Falta password!')
  if (!region) return res.status(200).json('Falta parametro region!')

  try {
    const emailExist = await User.findOne({
      where: {
        email
      }
    })

    if (emailExist) {
      return res
        .status(200)
        .json('Existe un usuario con esa direccion de email. Prueba con una nueva!')
    }

    const usernameExist = await User.findOne({
      where: {
        username
      }
    })

    if (usernameExist) {
      return res
        .status(200)
        .json('Existe un usuario con ese username. Pruebe con una nuevo!')
    }

    const userCreated = await userController.createUser(
      username,
      email,
      password,
      region
    )

    /*
    const mailOptions = {
      from: 'e.winemarketplace@hotmail.com',
      to: email,
      subject: 'Creaste tu cuenta en E-Wines',
      html: await readFile('./message.html', 'utf-8'),
      attachments: [
        {
          filename: 'logo.jpeg',
          path: './logo.jpeg'
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
 */
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
    res.status(400).json('Error tratando de subir la imagen de usuario!')
  }
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { banned, sommelier, verified } = req.query

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
  } catch (error) {
    res.status(400).json(error.message)
  }
})

module.exports = router
