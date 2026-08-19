const { handler } = require("./todo");

async function main() {

    // Create Todo
    const createEvent = {
        httpMethod: "POST",
        path: "/todos",
        pathParameters: null,
        queryStringParameters: null,
        body: JSON.stringify({
            title: "Learn Lambda"
        })
    };

    const createResponse = await handler(createEvent);

    console.log("CREATE:");
    console.log(createResponse);


    // Get Todos
    const getEvent = {
        httpMethod: "GET",
        path: "/todos",
        pathParameters: null,
        queryStringParameters: null,
        body: null
    };

    const getResponse = await handler(getEvent);

    console.log("\nGET:");
    console.log(getResponse);
}

main();