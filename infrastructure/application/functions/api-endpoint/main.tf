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
  uri = "${var.lambda_invoke_arn}"
}

resource "aws_lambda_permission" "api_lambda_permission" {
  function_name = "${var.lambda_name}"
  statement_id = "AllowExecutionFromApiGateway"
  action = "lambda:InvokeFunction"
  principal = "apigateway.amazonaws.com"
  source_arn = "arn:aws:execute-api:us-east-1:745715572008:${var.rest_api_id}/*/${aws_api_gateway_method.api_method.http_method}${var.resource_path}"
}
