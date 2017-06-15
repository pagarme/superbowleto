provider "aws" {
  region = "us-east-1"
  profile = "superbowleto"
}

terraform {
  backend "s3" {
    bucket = "terraform-state-superbowleto-infrastructure-lock"
    key = "production/terraform.tfstate"
    region = "us-east-1"
    lock_table = "terraform-state-superbowleto-infrastructure-lock"
  }
}

module "management" {
  source = "./management"
}

module "network" {
  source = "./network"
}

module "sqs" {
  source = "./sqs"
}

module "database" {
  source = "./database"

  database_subnet_group_name = "${module.network.database_subnet_group_name}"
  database_security_group_ids = "${module.network.database_security_group_ids}"
}

module "iam" {
  source = "./iam"

  sqs_queue_arns = "${module.sqs.sqs_queue_arns}"
  credstash_secret_reader_policy_arn = "${module.management.credstash_secret_reader_policy_arn}"
}

module "api-gateway" {
  source = "./api-gateway"
}
