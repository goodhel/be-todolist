// Helper database yang di buat
const mysql = require('../helpers/database')
// Validation input
const Joi = require('joi')

class _todo {
    // List all todos
    listTodo = async (body = {}) => {
        try {
            const schema = Joi.object({
                user_id: Joi.number()
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

            const sql = {
                query: `
                SELECT  
                    dt.id,
                    dt.title,
                    dt.description,
                    dt.created_at,
                    dt.updated_at,
                    dt.user_id,
                    au.username
                FROM d_todo dt
                JOIN auth_user au ON au.id = dt.user_id
                WHERE 1`,
                params: []
            }

            if (body.user_id) {
                sql.query += ' AND dt.user_id = ?'
                sql.params.push(body.user_id)
            }

            const list = await mysql.query(sql.query, sql.params)

            const data = []

            for (const value of list) {
                data.push({
                    id: value.id,
                    title: value.title,
                    description: value.description,
                    created_at: value.created_at,
                    updated_at: value.updated_at,
                    user: {
                        id: value.user_id,
                        username: value.username
                    }
                })
            }

            return {
                status: true,
                data
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
                `SELECT 
                    dt.id,
                    dt.title, 
                    dt.description, 
                    dt.created_at, 
                    dt.updated_at,
                    dt.user_id,
                    au.username
                FROM d_todo dt
                JOIN auth_user au ON au.id = dt.user_id
                WHERE dt.id = ?`,
                [id]
            )


            if (detailTodo.length <= 0) {
                return {
                    status: false,
                    code: 404,
                    error: 'Sorry, todo not found'
                }
            }

            const data = []
            for (const value of detailTodo) {
                data.push({
                    id: value.id,
                    title: value.title,
                    description: value.description,
                    created_at: value.created_at,
                    updated_at: value.updated_at,
                    user: {
                        id: value.user_id,
                        username: value.username
                    }
                })
            }

            return {
                status: true,
                data: data[0]
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
                user_id: Joi.number().required(),
                description: Joi.string(),
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
                'INSERT INTO d_todo (title, description, user_id) VALUES (?, ?, ?)',
                [body.title, body.description, body.user_id]
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
                user_id: Joi.number(),
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
                'UPDATE d_todo SET title = ?, description = ?, user_id = ? WHERE id = ?',
                [body.title, body.description, body.user_id, body.id]
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