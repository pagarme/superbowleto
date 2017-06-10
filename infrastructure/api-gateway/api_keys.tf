resource "aws_api_gateway_usage_plan" "pagarme" {
  name = "pagarme"
  description = "Usage plan meant to be used by Pagar.me Services"

  api_stages {
    api_id = "${aws_api_gateway_rest_api.rest_api.id}"
    stage = "${var.stage}"
  }
}

resource "aws_api_gateway_api_key" "pagarme" {
  name = "pagarme"

  stage_key {
    rest_api_id = "${aws_api_gateway_rest_api.rest_api.id}"
    stage_name = "${var.stage}"
  }
}

resource "aws_api_gateway_usage_plan_key" "pagarme" {
  key_id = "${aws_api_gateway_api_key.pagarme.id}"
  key_type = "API_KEY"
  usage_plan_id = "${aws_api_gateway_usage_plan.pagarme.id}"
}
