resource "aws_cloudwatch_event_rule" "schedule_rule" {
  name = "schedule-${var.lambda_name}"
  schedule_expression = "${var.schedule_expression}"
  is_enabled = "${var.is_enabled}"
}

resource "aws_cloudwatch_event_target" "schedule_target" {
  rule = "${aws_cloudwatch_event_rule.schedule_rule.name}"
  arn = "${var.lambda_arn}"
}

resource "aws_lambda_permission" "cloudwatch_lambda_permission" {
  function_name = "${var.lambda_name}"
  statement_id = "AllowExecutionFromCloudWatch"
  action = "lambda:InvokeFunction"
  principal = "events.amazonaws.com"
  source_arn = "${aws_cloudwatch_event_rule.schedule_rule.arn}"
}
