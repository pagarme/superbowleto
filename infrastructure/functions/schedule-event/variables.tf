variable "lambda_arn" {
  type = "string"
}

variable "lambda_name" {
  type = "string"
}

variable "schedule_expression" {
  type = "string"
}

variable "is_enabled" {
  default = false
}
