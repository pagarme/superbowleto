module "create-boleto" {
  source = "./endpoint"

  rest_api_id = "${aws_api_gateway_rest_api.rest_api.id}"
  resource_id = "${aws_api_gateway_resource.resource_boleto_root.id}"
  resource_path = "${aws_api_gateway_resource.resource_boleto_root.path}"
  method = "POST"
  stage = "${var.stage}"
  lambda_name = "superbowleto-${var.stage}-create-boleto"
}

module "index-boleto" {
  source = "./endpoint"

  rest_api_id = "${aws_api_gateway_rest_api.rest_api.id}"
  resource_id = "${aws_api_gateway_resource.resource_boleto_root.id}"
  resource_path = "${aws_api_gateway_resource.resource_boleto_root.path}"
  method = "GET"
  stage = "${var.stage}"
  lambda_name = "superbowleto-${var.stage}-index-boleto"
}

module "show-boleto" {
  source = "./endpoint"

  rest_api_id = "${aws_api_gateway_rest_api.rest_api.id}"
  resource_id = "${aws_api_gateway_resource.resource_boleto_id.id}"
  resource_path = "${aws_api_gateway_resource.resource_boleto_id.path}"
  method = "GET"
  stage = "${var.stage}"
  lambda_name = "superbowleto-${var.stage}-show-boleto"
}

module "update-boleto" {
  source = "./endpoint"

  rest_api_id = "${aws_api_gateway_rest_api.rest_api.id}"
  resource_id = "${aws_api_gateway_resource.resource_boleto_id.id}"
  resource_path = "${aws_api_gateway_resource.resource_boleto_id.path}"
  method = "PATCH"
  stage = "${var.stage}"
  lambda_name = "superbowleto-${var.stage}-show-boleto"
}
