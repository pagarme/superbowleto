variable "stage" {
  type = "string"
  default = "sandbox"
}

variable "database_security_group_ids" {
  type = "list"
}

variable "database_subnet_group_name" {
  type = "string"
}
