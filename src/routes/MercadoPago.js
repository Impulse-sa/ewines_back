// const express = require('express')
// const router = express.Router()
const server = require('express').Router()

// SDK de Mercado Pago
const mercadopago = require('mercadopago')

// middleware
// app.use(bodyParser.urlencoded({ extended: false }))

// Agrega credenciales
mercadopago.configure({
  /* access_token: process.env.ACCESS_TOKEN_MP */
  access_token: 'TEST-1978965847766511-101821-43fc6f1389c8d0df59ec6c550f6591f0-1220528859'
})

// routes
// TODO back_urls MODIICAR
server.post('/', (req, res) => {
// Crea un objeto de preferencia
  const preference = {

    items: req.body.map(item => { return { ...item, currency_id: 'ARS' } }),
    back_urls: {
      success: 'http://localhost:3000/userPurchased/',
      failure: 'http://localhost:3000',
      pending: 'http://localhost:3000'
    },
    notification_url: 'https://e-winespf.herokuapp.com/notificacion'
  }

  mercadopago.preferences.create(preference)
    .then(function (response) {
      res.status(200).json({ data: response.body.init_point })
    }).catch(function (error) {
      console.log(error)
    })
})

module.exports = server
