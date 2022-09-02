// Helper database yang di buat
const mysql = require('../helpers/database')
// Validation input
const Joi = require('joi')

class _todo {
    // List all todos
    listTodo = async () => {
        try {
            const list = await mysql.query(
                'SELECT * FROM d_todo',
                []
            )

            return {
                status: true,
                data: list
            }
        } catch (error) {
            console.error('listTodo todo module Error: ', error)

            return {
                status: false,
                error
            }
        }
    }

    // Detail Todo
    detailTodo = async (id) => {
        try {
            const schema = Joi.number().required()

            const validation = schema.validate(id)

            if (validation.error) {
                const errorDetails = validation.error.details.map(detail => detail.message)

                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(', ')
                }
            }

            const detailTodo = await mysql.query(
                'SELECT id, title, description, created_at, updated_at FROM d_todo WHERE id = ?',
                [id]
            )


            if (detailTodo.length <= 0) {
                return {
                    status: false,
                    code: 404,
                    error: 'Sorry, todo not found'
                }
            }

            return {
                status: true,
                data: detailTodo[0]
            }
        } catch (error) {
            console.error('detailTodo todo module Error: ', error)

            return {
                status: false,
                error: error
            }
        }
    }

    // Create Todo
    addTodo = async (body) => {
        try {
            const schema = Joi.object({
                title: Joi.string().required(),
                description: Joi.string()
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
                'INSERT INTO d_todo (title, description) VALUES (?, ?)',
                [body.title, body.description]
            )

            return {
                status: true,
                data: add
            }
        } catch (error) {
            console.error('addTodo todo module Error: ', error)

            return {
                status: false,
                error
            }
        }
    }

    // Update Todo
    editTodo = async (body) => {
        try {
            const schema = Joi.object({
                id: Joi.number().required(),
                title: Joi.string(),
                description: Joi.string()
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

            const edit = await mysql.query(
                'UPDATE d_todo SET title = ?, description = ? WHERE id = ?',
                [body.title, body.description, body.id]
            )

            return {
                status: true,
                data: edit
            }
        } catch (error) {
            console.error('addTodo todo module Error: ', error)

            return {
                status: false,
                error
            }
        }
    }

    // Delete Todo
    deleteTodo = async (id) => {
        try {
            const body = { id }
            const schema = Joi.object({
                id: Joi.number().required()
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

            const del = await mysql.query(
                'DELETE FROM d_todo WHERE id = ?',
                [id]
            )

            return {
                status: true,
                data: del
            }
        } catch (error) {
            console.error('deleteTodo todo module Error: ', error)

            return {
                status: false,
                error
            }
        }
    }
}

module.exports = new _todo()