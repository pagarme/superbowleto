module "endpoint_create_boleto" {
  source = "./api-endpoint"
  stage = "${var.stage}"

  rest_api_id = "${aws_api_gateway_rest_api.rest_api.id}"
  resource_id = "${aws_api_gateway_resource.resource_boleto_root.id}"
  resource_path = "${aws_api_gateway_resource.resource_boleto_root.path}"
  method = "POST"
  lambda_name = "${module.function_create_boleto.function_name}"
  lambda_invoke_arn = "${module.function_create_boleto.invoke_arn}"
}

module "endpoint_index_boleto" {
  source = "./api-endpoint"
  stage = "${var.stage}"

  rest_api_id = "${aws_api_gateway_rest_api.rest_api.id}"
  resource_id = "${aws_api_gateway_resource.resource_boleto_root.id}"
  resource_path = "${aws_api_gateway_resource.resource_boleto_root.path}"
  method = "GET"
  lambda_name = "${module.function_index_boleto.function_name}"
  lambda_invoke_arn = "${module.function_index_boleto.invoke_arn}"
}

module "endpoint_show_boleto" {
  source = "./api-endpoint"
  stage = "${var.stage}"

  rest_api_id = "${aws_api_gateway_rest_api.rest_api.id}"
  resource_id = "${aws_api_gateway_resource.resource_boleto_id.id}"
  resource_path = "${aws_api_gateway_resource.resource_boleto_id.path}"
  method = "GET"
  lambda_name = "${module.function_show_boleto.function_name}"
  lambda_invoke_arn = "${module.function_show_boleto.invoke_arn}"
}

module "endpoint_update_boleto" {
  source = "./api-endpoint"
  stage = "${var.stage}"

  rest_api_id = "${aws_api_gateway_rest_api.rest_api.id}"
  resource_id = "${aws_api_gateway_resource.resource_boleto_id.id}"
  resource_path = "${aws_api_gateway_resource.resource_boleto_id.path}"
  method = "PATCH"
  lambda_name = "${module.function_update_boleto.function_name}"
  lambda_invoke_arn = "${module.function_update_boleto.invoke_arn}"
}

module "schedule_process_boletos_to_register" {
  source = "./schedule-event"

  lambda_arn = "${module.function_process_boletos_to_register.function_arn}"
  lambda_name = "${module.function_process_boletos_to_register.function_name}"
  schedule_expression = "rate(5 minutes)"
  is_enabled = true
}
