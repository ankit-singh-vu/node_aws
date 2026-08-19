const fs = require("fs");
const { handler } = require("./todo");

async function main() {
    const method = process.argv[2];
    const path = process.argv[3];
    const bodyFile = process.argv[4];

    if (!method || !path) {
        console.log("Usage:");
        console.log("node run.js GET /todos");
        console.log("node run.js GET /todos/:id");
        console.log("node run.js POST /todos request.json");
        console.log("node run.js PUT /todos/:id request.json");
        console.log("node run.js DELETE /todos/:id");
        return;
    }

    const pathParts = path.split("/");
    const id = pathParts.length === 3 ? pathParts[2] : null;

    let requestBody = null;

    if (bodyFile) {
        try {
            requestBody = fs.readFileSync(bodyFile, "utf8");
            JSON.parse(requestBody);
        } catch (error) {
            console.error("Invalid JSON file:", bodyFile);
            return;
        }
    }

    const event = {
        httpMethod: method,
        path,
        pathParameters: id ? { id } : null,
        queryStringParameters: null,
        body: requestBody
    };

    const response = await handler(event);

    console.log("Response:");
    console.log(response);
}

main();