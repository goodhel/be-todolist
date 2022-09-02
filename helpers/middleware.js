const mysql = require('../helpers/database')
const config = require('../config/app.config.json')
const jwt = require('jsonwebtoken')

const userSession = async (req, res, next) => {
    let token
  
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        token = req.headers.authorization.split(' ')[1]
  
        const decoded = jwt.verify(token, config.jwt.secret)
  
        const user = await mysql.query(
            `SELECT id, username FROM auth_user WHERE id = ?`,
            [decoded.id]
        )
  
        if (user) {
          req.user = {
            id: user[0].id,
            username: user[0].username,
          }
  
          next()
        } else {
          res.status(401).send({ message: 'Not authorized' })
        }
      } catch (error) {
        // console.error('Middleware user not authorized Error: ', error)
        res.status(401).send({ message: 'Not authorized Error. Token Expired.' })
      }
    }
  
    if (!token) {
      res.status(401).send({
        message: 'Not authenticated, no token'
      })
    }
}

module.exports = userSession
  