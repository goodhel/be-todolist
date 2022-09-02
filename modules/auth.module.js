const mysql = require('../helpers/database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config/app.config.json')
const date = require('date-and-time')
const Joi = require('joi')

class _auth {
    login = async (body) => {
        try {
            const schema = Joi.object({
                username: Joi.string().required(),
                password: Joi.string().required(),
            })

            const validation = schema.validate(body)

            if (validation.error) {
                const errorDetails = validation.error.details.map(detail => detail.message)

                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(', ')
                }
            }

            const checkUser = await mysql.query(
                'SELECT id, username, password FROM auth_user WHERE username = ?',
                [body.username]
            )

            if (checkUser.length < 0) {
                return {
                    status: false,
                    code: 404,
                    error: 'Sorry, user not found'
                }
            }

            const checkPassword = bcrypt.compareSync(body.password, checkUser[0].password)

            if (!checkPassword) {
                return {
                    status: false,
                    code: 401,
                    error: 'Sorry, password not match'
                }
            }

            const payload = {
                id: checkUser[0].id,
                username: checkUser[0].username
            }

            const { secret, expired } = config.jwt

            const token = jwt.sign(payload, secret, { expiresIn: String(expired)} )
            const expiresAt = date.format(new Date( Date.now() + expired), 'YYYY-MM-DD HH:mm:ss') 

            return {
                status: true,
                data: {
                    token,
                    expiresAt
                }
            }
        } catch (error) {
            console.error('login auth module Error: ', error)

            return {
                status: false,
                error
            }
        }
    }
}

module.exports = new _auth()