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

module "iam" {
  source = "./iam"

  credstash_secret_reader_policy_arn = "${module.management.credstash_secret_reader_policy_arn}"
}

module "sandbox" {
  source = "./application"

  lambda_execution_role_name = "${module.iam.lambda_execution_role_name}"
  lambda_execution_role_arn = "${module.iam.lambda_execution_role_arn}"
  lambda_security_group_ids = "${module.network.lambda_security_group_ids}"
  lambda_subnet_ids = "${module.network.lambda_subnet_ids}"

  database_subnet_group_name = "${module.network.database_subnet_group_name}"
  database_security_group_ids = "${module.network.database_security_group_ids}"
}
