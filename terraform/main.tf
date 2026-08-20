terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = "ap-south-1"
}

resource "aws_dynamodb_table" "todos" {
  name         = "Todos"
  billing_mode = "PAY_PER_REQUEST"

  hash_key = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_iam_role" "lambda_role" {
  name = "todo-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Principal = {
          Service = "lambda.amazonaws.com"
        }

        Action = "sts:AssumeRole"
      }
    ]
  })
}


resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "lambda_dynamodb" {
  name = "todo-lambda-dynamodb"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Scan"
        ]

        Resource = aws_dynamodb_table.todos.arn
      }
    ]
  })
}

resource "aws_lambda_function" "todo" {
  function_name = "todo-function"

  filename         = "../lambda.zip"
  source_code_hash = filebase64sha256("../lambda.zip")

  handler = "todo.handler"
  runtime = "nodejs22.x"

  role = aws_iam_role.lambda_role.arn

  timeout     = 10
  memory_size = 256
}


resource "aws_apigatewayv2_api" "todo_api" {
  name          = "todo-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "todo_lambda" {
  api_id                 = aws_apigatewayv2_api.todo_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.todo.invoke_arn
  integration_method     = "POST"
  payload_format_version = "1.0"
}

# resource "aws_apigatewayv2_route" "todo_route" {
#   api_id    = aws_apigatewayv2_api.todo_api.id
#   route_key = "$default"
#   target    = "integrations/${aws_apigatewayv2_integration.todo_lambda.id}"
# }
resource "aws_apigatewayv2_route" "get_todos" {
  api_id    = aws_apigatewayv2_api.todo_api.id
  route_key = "GET /todos"
  target    = "integrations/${aws_apigatewayv2_integration.todo_lambda.id}"
}

resource "aws_apigatewayv2_route" "create_todo" {
  api_id    = aws_apigatewayv2_api.todo_api.id
  route_key = "POST /todos"
  target    = "integrations/${aws_apigatewayv2_integration.todo_lambda.id}"
}

resource "aws_apigatewayv2_route" "get_todo" {
  api_id    = aws_apigatewayv2_api.todo_api.id
  route_key = "GET /todos/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.todo_lambda.id}"
}

resource "aws_apigatewayv2_route" "update_todo" {
  api_id    = aws_apigatewayv2_api.todo_api.id
  route_key = "PUT /todos/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.todo_lambda.id}"
}

resource "aws_apigatewayv2_route" "delete_todo" {
  api_id    = aws_apigatewayv2_api.todo_api.id
  route_key = "DELETE /todos/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.todo_lambda.id}"
}


resource "aws_apigatewayv2_stage" "todo_stage" {
  api_id      = aws_apigatewayv2_api.todo_api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowApiGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.todo.function_name
  principal     = "apigateway.amazonaws.com"
}

output "todo_api_url" {
  value = aws_apigatewayv2_stage.todo_stage.invoke_url
}