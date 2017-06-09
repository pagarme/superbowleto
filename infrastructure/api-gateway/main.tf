resource "aws_api_gateway_rest_api" "rest_api" {
  name = "Superbowleto"
  description = "Superbowleto API"
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
