provider "aws" {
  region = "us-east-1"
  profile = "superbowleto"
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
