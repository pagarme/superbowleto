data "null_data_source" "environment_variables" {
  inputs = {
    STAGE = "${var.stage}"
    BOLETOS_TO_REGISTER_QUEUE_URL = "${var.boletos_to_register_queue_url}"
    DATABASE_ENDPOINT = "${var.database_endpoint}"
    DATABASE_USERNAME = "${var.database_username}"
  }
}

module "function_create_boleto" {
  source = "./lambda-function"
  name = "create-boleto"
  handler = "dist/boleto.create"
  role = "${var.lambda_execution_role_arn}"

  subnet_ids = ["${var.lambda_subnet_ids}"]
  security_group_ids = ["${var.lambda_security_group_ids}"]
  environment_variables = "${data.null_data_source.environment_variables.inputs}"
}

module "function_index_boleto" {
  source = "./lambda-function"
  name = "index-boleto"
  handler = "dist/boleto.index"
  role = "${var.lambda_execution_role_arn}"

  subnet_ids = ["${var.lambda_subnet_ids}"]
  security_group_ids = ["${var.lambda_security_group_ids}"]
  environment_variables = "${data.null_data_source.environment_variables.inputs}"
}

module "function_show_boleto" {
  source = "./lambda-function"
  name = "show-boleto"
  handler = "dist/boleto.show"
  role = "${var.lambda_execution_role_arn}"

  subnet_ids = ["${var.lambda_subnet_ids}"]
  security_group_ids = ["${var.lambda_security_group_ids}"]
  environment_variables = "${data.null_data_source.environment_variables.inputs}"
}

module "function_update_boleto" {
  source = "./lambda-function"
  name = "update-boleto"
  handler = "dist/boleto.update"
  role = "${var.lambda_execution_role_arn}"

  subnet_ids = ["${var.lambda_subnet_ids}"]
  security_group_ids = ["${var.lambda_security_group_ids}"]
  environment_variables = "${data.null_data_source.environment_variables.inputs}"
}

module "function_register_boleto" {
  source = "./lambda-function"
  name = "register-boleto"
  handler = "dist/boleto.register"
  role = "${var.lambda_execution_role_arn}"

  subnet_ids = ["${var.lambda_subnet_ids}"]
  security_group_ids = ["${var.lambda_security_group_ids}"]
  environment_variables = "${data.null_data_source.environment_variables.inputs}"
}

module "function_process_boletos_to_register" {
  source = "./lambda-function"
  name = "process-boletos-to-register"
  handler = "dist/boleto.processBoletosToRegister"
  role = "${var.lambda_execution_role_arn}"

  subnet_ids = ["${var.lambda_subnet_ids}"]
  security_group_ids = ["${var.lambda_security_group_ids}"]
  environment_variables = "${data.null_data_source.environment_variables.inputs}"
}

module "function_migrate_database" {
  source = "./lambda-function"
  name = "migrate-database"
  handler = "dist/database.migrate"
  role = "${var.lambda_execution_role_arn}"

  timeout = "60"
  memory_size = "512"

  subnet_ids = ["${var.lambda_subnet_ids}"]
  security_group_ids = ["${var.lambda_security_group_ids}"]
  environment_variables = "${data.null_data_source.environment_variables.inputs}"
}
