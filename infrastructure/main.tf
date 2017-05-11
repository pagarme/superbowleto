provider "aws" {
  region = "us-east-1"
  profile = "terraform"
}

module "sqs" {
  source = "./sqs"
}

module "database" {
  source = "./database"
}

module "iam" {
  source = "./iam"
  sqs_queues_arns = "${module.sqs.queues_arns}"
}
