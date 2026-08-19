const {
    getTodos,
    createTodo,
    getTodoById,
    updateTodo,
    deleteTodo
} = require("./src/todoRepository");

exports.handler = async (event) => {

    try {

        const method = event.httpMethod;
        const id = event.pathParameters?.id
            ? String(event.pathParameters.id)
            : null;

        // GET /todos
        if (method === "GET" && !id) {

            const todos = await getTodos();

            return {
                statusCode: 200,
                body: JSON.stringify(todos)
            };
        }

        // GET /todos/:id
        if (method === "GET" && id) {

            const todo = await getTodoById(id);

            if (!todo) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({
                        message: "Todo not found"
                    })
                };
            }

            return {
                statusCode: 200,
                body: JSON.stringify(todo)
            };
        }

        // POST /todos
        if (method === "POST") {

            const data = JSON.parse(event.body || "{}");

            if (!data.title) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        message: "Title is required"
                    })
                };
            }
            const todo = {
                id: String(Date.now()),
                title: data.title,
                completed: false
            };

            const createdTodo = await createTodo(todo);

            return {
                statusCode: 201,
                body: JSON.stringify(createdTodo)
            };
        }

        // PUT /todos/:id
        if (method === "PUT" && id) {

            const data = JSON.parse(event.body || "{}");

            const updatedTodo = await updateTodo(id, data);

            if (!updatedTodo) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({
                        message: "Todo not found"
                    })
                };
            }

            return {
                statusCode: 200,
                body: JSON.stringify(updatedTodo)
            };
        }

        // DELETE /todos/:id
        if (method === "DELETE" && id) {

            const deletedTodo = await deleteTodo(id);

            if (!deletedTodo) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({
                        message: "Todo not found"
                    })
                };
            }

            return {
                statusCode: 200,
                body: JSON.stringify(deletedTodo)
            };
        }

        return {
            statusCode: 404,
            body: JSON.stringify({
                message: "Route not found"
            })
        };

    } catch (error) {

        console.error(error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Internal server error"
            })
        };
    }
};