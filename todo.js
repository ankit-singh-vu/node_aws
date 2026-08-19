const todos = [];

exports.handler = async (event) => {
    try {
        const method = event.httpMethod;

        // GET /todos
        if (method === "GET" && !event.pathParameters?.id) {
            return {
                statusCode: 200,
                body: JSON.stringify(todos)
            };
        }

        // GET /todos/:id
        if (method === "GET" && event.pathParameters?.id) {
            const id = Number(event.pathParameters.id);

            const todo = todos.find(todo => todo.id === id);

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
                id: Date.now(),
                title: data.title,
                completed: false
            };

            todos.push(todo);

            return {
                statusCode: 201,
                body: JSON.stringify(todo)
            };
        }

        // PUT /todos/:id
        if (method === "PUT" && event.pathParameters?.id) {
            const id = Number(event.pathParameters.id);

            const todo = todos.find(todo => todo.id === id);

            if (!todo) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({
                        message: "Todo not found"
                    })
                };
            }

            const data = JSON.parse(event.body || "{}");

            if (data.title !== undefined) {
                todo.title = data.title;
            }

            if (data.completed !== undefined) {
                todo.completed = data.completed;
            }

            return {
                statusCode: 200,
                body: JSON.stringify(todo)
            };
        }

        // DELETE /todos/:id
        if (method === "DELETE" && event.pathParameters?.id) {
            const id = Number(event.pathParameters.id);

            const index = todos.findIndex(todo => todo.id === id);

            if (index === -1) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({
                        message: "Todo not found"
                    })
                };
            }

            const deletedTodo = todos.splice(index, 1)[0];

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