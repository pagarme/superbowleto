resource "aws_api_gateway_method" "api_method" {
  rest_api_id = "${var.rest_api_id}"
  resource_id = "${var.resource_id}"
  http_method = "${var.method}"
  authorization = "NONE"
  api_key_required = true
}

resource "aws_api_gateway_integration" "api_lambda_integration" {
  rest_api_id = "${var.rest_api_id}"
  resource_id = "${var.resource_id}"
  http_method = "${aws_api_gateway_method.api_method.http_method}"
  integration_http_method = "POST"
  type = "AWS_PROXY"
  uri = "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:745715572008:function:${var.lambda_name}/invocations"
}

resource "aws_lambda_permission" "api_lambda_permission" {
  function_name = "${var.lambda_name}"
  statement_id = "AllowExecutionFromApiGateway"
  action = "lambda:InvokeFunction"
  principal = "apigateway.amazonaws.com"
  source_arn = "arn:aws:execute-api:us-east-1:745715572008:${var.rest_api_id}/*/${aws_api_gateway_method.api_method.http_method}${var.resource_path}"
}

resource "aws_api_gateway_deployment" "api_deployment" {
  rest_api_id = "${var.rest_api_id}"
  stage_name = "${var.stage}"

  depends_on = [
    "aws_api_gateway_method.api_method",
    "aws_api_gateway_integration.api_lambda_integration"
  ]
}
