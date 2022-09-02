const TodoController = require("./controllers/TodoController");
const UserController = require("./controllers/UserControlller");

// Define url API in Here
const _routes = [
    ['/todos', TodoController],
    ['/user', UserController],
]

// http://localhost:5001/api/todos

const routes = (app) => {
    _routes.forEach((route) => {
        const [ url, controller ] = route
        app.use(`/api${url}`, controller)
    })
}

module.exports = routes