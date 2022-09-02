const mysql = require('../helpers/database')
const Joi = require('joi')

class _comment {
    addComment = async (body) => {
        try {
            const schema = Joi.object({
                user_id: Joi.number().required(),
                todo_id: Joi.number().required(),
                comment: Joi.string().required(),
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

            const add = await mysql.query(
                'INSERT INTO d_comment_todo (todo_id, user_id, comment) VALUES (?, ?, ?)',
                [body.todo_id, body.user_id, body.comment]
            )

            return {
                status: true,
                data: add
            }
        } catch (error) {
            console.error('addComment comment module Error: ', error)

            return {
                status: false,
                error
            }
        }
    }
}

module.exports = new _comment()