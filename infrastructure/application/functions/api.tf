resource "aws_api_gateway_rest_api" "rest_api" {
  name = "${var.stage}-superbowleto"
  description = "superbowleto API"
}

resource "aws_api_gateway_resource" "resource_boleto_root" {
  rest_api_id = "${aws_api_gateway_rest_api.rest_api.id}"
  parent_id = "${aws_api_gateway_rest_api.rest_api.root_resource_id}"
  path_part = "boletos"
}

resource "aws_api_gateway_resource" "resource_boleto_id" {
  rest_api_id = "${aws_api_gateway_rest_api.rest_api.id}"
  parent_id = "${aws_api_gateway_resource.resource_boleto_root.id}"
  path_part = "{id}"
}

resource "aws_api_gateway_deployment" "api_deployment" {
  rest_api_id = "${aws_api_gateway_rest_api.rest_api.id}"
  stage_name = "${var.stage}"

  depends_on = [
    "module.endpoint_create_boleto",
    "module.endpoint_index_boleto",
    "module.endpoint_show_boleto",
    "module.endpoint_update_boleto"
  ]
}

resource "aws_api_gateway_usage_plan" "pagarme" {
  name = "pagarme"
  description = "Usage plan meant to be used by Pagar.me Services"

  api_stages {
    api_id = "${aws_api_gateway_rest_api.rest_api.id}"
    stage = "${aws_api_gateway_deployment.api_deployment.stage_name}"
  }
}

resource "aws_api_gateway_api_key" "pagarme" {
  name = "pagarme"
  description = "API key meant to be used by Pagar.me Services"
}

resource "aws_api_gateway_usage_plan_key" "pagarme" {
  key_id = "${aws_api_gateway_api_key.pagarme.id}"
  key_type = "API_KEY"
  usage_plan_id = "${aws_api_gateway_usage_plan.pagarme.id}"
}
