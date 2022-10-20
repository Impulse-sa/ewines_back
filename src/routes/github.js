const { Router } = require('express')
const router = Router()
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))
/* const jwt = require('jsonwebtoken') */

const CLIENT_ID = '16195f4d0c06b0663b86'
const CLIENT_SECRET = 'c1d7e4edad1e3788e11a1eb66de59dec2053e44c'

router.get('/getAccessToken', async (req, res) => {
  const params = '?client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&code=' + req.query.code

  await fetch('https://github.com/login/oauth/access_token' + params, {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    }
  }).then(response => {
    return response.json()
  }).then(data => {
    console.log(data)
    res.json(data)
  })
})

router.get('/getUserData', async (req, res) => {
  await fetch('https://api.github.com/user', {
    method: 'GET',
    headers: {
      Authorization: req.get('Authorization')
    }
  }).then(response => {
    return response.json()
  }).then(data => {
    console.log(data)
    res.json()
  })
})

module.exports = router
