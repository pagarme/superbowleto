provider "aws" {
  region = "us-east-1"
  profile = "superbowleto"
}

module "management" {
  source = "./management"
}

terraform {
  backend "s3" {
    bucket = "terraform-state-superbowleto-infrastructure-lock"
    key = "production/terraform.tfstate"
    region = "us-east-1"
    lock_table = "terraform-state-superbowleto-infrastructure-lock"
  }
}

module "network" {
  source = "./network"
}

module "sqs" {
  source = "./sqs"
}

module "database" {
  source = "./database"

  database_subnet_ids = "${module.network.database_subnet_ids}"
  database_security_group_id = "${module.network.database_security_group_id}"
}

module "iam" {
  source = "./iam"

  sqs_queue_arns = "${module.sqs.sqs_queue_arns}"
}
