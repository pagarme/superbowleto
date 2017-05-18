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
