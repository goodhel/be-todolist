const { Router } = require('express')
const m$todo = require('../modules/todo.module')
const response = require('../helpers/response')

const TodoController = Router()

/**
 * List Todo
 */
TodoController.get('/', async (req, res, next) => {
    const list = await m$todo.listTodo(req.query)

    response.sendResponse(res, list)
})

/**
 * Detail Todo
 */
TodoController.get('/detail', async (req, res, next) => {
    // req.query
    // http://localhost:5001/api/todos/detail?id=1
    const detail = await m$todo.detailTodo(req.query.id)

    response.sendResponse(res, detail)
})

/**
 * Add Todo
 * @param {string} title
 * @param {string} description
 */
TodoController.post('/', async (req, res, next) => {
    // req.body req.params req.query
    const add = await m$todo.addTodo(req.body)

    response.sendResponse(res, add)
})

/**
 * Edit Todo
 * @param {number} id
 * @param {string} title
 * @param {string} description
 */
TodoController.put('/', async (req, res, next) => {
    const edit = await m$todo.editTodo(req.body)

    response.sendResponse(res, edit)
})

/**
 * Delete Todo
 * @param {number} id
 */
TodoController.delete('/:id', async (req, res, next) => {
    const del = await m$todo.deleteTodo(req.params.id)

    response.sendResponse(res, del)
})

module.exports = TodoController
