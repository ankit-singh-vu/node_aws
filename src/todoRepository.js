const fs = require("fs/promises");
const path = require("path");

const filePath = path.join(__dirname, "../data/todos.json");

async function getTodos() {
    const data = await fs.readFile(filePath, "utf-8");

    if (!data.trim()) {
        return [];
    }

    return JSON.parse(data);
}

async function saveTodos(todos) {
    await fs.writeFile(
        filePath,
        JSON.stringify(todos, null, 2)
    );
}

async function createTodo(todo) {
    const todos = await getTodos();

    todos.push(todo);

    await saveTodos(todos);

    return todo;
}

async function getTodoById(id) {
    const todos = await getTodos();

    return todos.find(todo => todo.id === id);
}

async function updateTodo(id, data) {
    const todos = await getTodos();

    const index = todos.findIndex(todo => todo.id === id);

    if (index === -1) {
        return null;
    }

    todos[index] = {
        ...todos[index],
        ...data
    };

    await saveTodos(todos);

    return todos[index];
}

async function deleteTodo(id) {
    const todos = await getTodos();

    const index = todos.findIndex(todo => todo.id === id);

    if (index === -1) {
        return null;
    }

    const deletedTodo = todos[index];

    todos.splice(index, 1);

    await saveTodos(todos);

    return deletedTodo;
}

module.exports = {
    getTodos,
    createTodo,
    getTodoById,
    updateTodo,
    deleteTodo
};

