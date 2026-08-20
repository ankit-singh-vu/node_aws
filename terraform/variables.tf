variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-south-1"
}

variable "dynamodb_table_name" {
  description = "DynamoDB table name"
  type        = string
  default     = "Todos"
}

variable "lambda_function_name" {
  description = "Lambda function name"
  type        = string
  default     = "todo-function"
}

variable "lambda_role_name" {
  description = "IAM role name for Lambda"
  type        = string
  default     = "todo-lambda-role"
}

variable "api_name" {
  description = "API Gateway API name"
  type        = string
  default     = "todo-api"
}