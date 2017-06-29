variable "vpc_cidr" {
  type = "string"
  default = "10.0.0.0/16"
}

variable "az_list" {
  type = "list"
  default = [
    "us-east-1a",
    "us-east-1b"
  ]
}
