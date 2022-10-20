const { Router } = require('express')
const router = Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')

router.get('/github', passport.authenticate('github'))

router.get(
  '/github/callback',
  passport.authenticate('github'),
  function (req, res) {
    const token = jwt.sign({
      userId: req.user.id,
      email: req.user.email,
      username: req.user.username
    }, 'RANDOM_TOKEN', { expiresIn: '24h' })

    res.status(200).json({ user: req.user, token })
  }
)

router.get('/logout', (req, res, next) => {
  req.session.destroy(function (err) {
    if (err) return next(err)
  })
  res.clearCookie('connect.sid')
})

module.exports = router
