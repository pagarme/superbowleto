variable "stage" {
  type = "string"
}

variable "account_id" {
  type = "string"
}

variable "region" {
  type = "string"
}

variable "lambda_execution_role_arn" {
  type = "string"
}

variable "lambda_subnet_ids" {
  type = "list"
}

variable "lambda_security_group_ids" {
  type = "list"
}

variable "boletos_to_register_queue_url" {
  type = "string"
}

variable "database_endpoint" {
  type = "string"
}

variable "database_username" {
  type = "string"
}
