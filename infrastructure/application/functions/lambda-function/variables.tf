variable "role" {
  type = "string"
}

variable "stage" {
  type = "string"
}

variable "name" {
  type = "string"
}

variable "handler" {
  type = "string"
}

variable "memory_size" {
  type = "string"
  default = "256"
}

variable "runtime" {
  type = "string"
  default = "nodejs6.10"
}

variable "timeout" {
  type = "string"
  default = "10"
}

variable "environment_variables" {
  type = "map"
}

variable "subnet_ids" {
  type = "list"
}

variable "security_group_ids" {
  type = "list"
}
