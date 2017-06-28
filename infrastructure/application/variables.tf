variable "stage" {
  type = "string"
  default = "sandbox"
}

variable "region" {
  type = "string"
}

variable "account_id" {
  type = "string"
}

variable "database_subnet_group_name" {
  type = "string"
}

variable "database_security_group_ids" {
  type = "list"
}

variable "lambda_execution_role_arn" {
  type = "string"
}

variable "lambda_execution_role_name" {
  type = "string"
}
variable "lambda_subnet_ids" {
  type = "list"
}

variable "lambda_security_group_ids" {
  type = "list"
}
