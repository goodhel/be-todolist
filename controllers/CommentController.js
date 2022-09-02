const { Router } = require("express");
const response = require("../helpers/response");
const m$comment = require('../modules/comment.module')

const CommentController = Router()

/**
 * Add Comment to TODO
 * @param {number} user_id 
 * @param {number} todo_id 
 * @param {string} comment 
 */
CommentController.post('/', async (req, res, next) => {
    const add = await m$comment.addComment(req.body)

    response.sendResponse(res, add)
})

module.exports = CommentController