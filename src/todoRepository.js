const {
    DynamoDBClient
} = require("@aws-sdk/client-dynamodb");

const {
    DynamoDBDocumentClient,
    PutCommand,
    ScanCommand,
    GetCommand,
    UpdateCommand,
    DeleteCommand
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({
    region: "ap-south-1"
});

const dynamoDB = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "Todos";

async function createTodo(todo) {
    await dynamoDB.send(
        new PutCommand({
            TableName: TABLE_NAME,
            Item: todo
        })
    );

    return todo;
}

async function getTodos() {
    const result = await dynamoDB.send(
        new ScanCommand({
            TableName: TABLE_NAME
        })
    );

    return result.Items || [];
}

async function getTodoById(id) {
    const result = await dynamoDB.send(
        new GetCommand({
            TableName: TABLE_NAME,
            Key: {
                id: id
            }
        })
    );

    return result.Item || null;
}

async function updateTodo(id, data) {
    const result = await dynamoDB.send(
        new UpdateCommand({
            TableName: TABLE_NAME,
            Key: {
                id: id
            },
            UpdateExpression: "SET #title = :title, #completed = :completed",
            ExpressionAttributeNames: {
                "#title": "title",
                "#completed": "completed"
            },
            ExpressionAttributeValues: {
                ":title": data.title,
                ":completed": data.completed
            },
            ConditionExpression: "attribute_exists(id)",
            ReturnValues: "ALL_NEW"
        })
    );

    return result.Attributes || null;
}

async function deleteTodo(id) {
    const result = await dynamoDB.send(
        new DeleteCommand({
            TableName: TABLE_NAME,
            Key: {
                id: id
            },
            ReturnValues: "ALL_OLD"
        })
    );

    return result.Attributes || null;
}

module.exports = {
    createTodo,
    getTodos,
    getTodoById,
    updateTodo,
    deleteTodo
};