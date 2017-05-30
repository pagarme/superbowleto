variable "vpc_cidr" {
  type = "string"
  default = "10.0.0.0/16"
}

variable "vpc_name" {
  type = "string"
  default = "Superbowleto"
}

variable "az_list" {
  type = "list"
  default = [
    "us-east-1a",
    "us-east-1b"
  ]
}
