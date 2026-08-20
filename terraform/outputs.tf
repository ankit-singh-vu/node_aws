output "todo_api_url" {
  description = "API Gateway URL"
  value       = aws_apigatewayv2_stage.todo_stage.invoke_url
}

output "lambda_function_name" {
  description = "Lambda function name"
  value       = aws_lambda_function.todo.function_name
}

output "dynamodb_table_name" {
  description = "DynamoDB table name"
  value       = aws_dynamodb_table.todos.name
}