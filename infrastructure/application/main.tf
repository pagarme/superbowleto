module "sqs" {
  source = "./sqs"
  stage = "${var.stage}"
}

module "database" {
  source = "./database"
  stage = "${var.stage}"

  database_subnet_group_name = "${var.database_subnet_group_name}"
  database_security_group_ids = "${var.database_security_group_ids}"
}

module "functions" {
  source = "./functions"
  stage = "${var.stage}"

  lambda_execution_role_arn = "${var.lambda_execution_role_arn}"
  lambda_subnet_ids = "${var.lambda_subnet_ids}"
  lambda_security_group_ids = "${var.lambda_security_group_ids}"

  boletos_to_register_queue_url = "${module.sqs.boletos_to_register_queue_url}"
  database_endpoint = "${module.database.endpoint}"
  database_username = "${module.database.username}"
}
