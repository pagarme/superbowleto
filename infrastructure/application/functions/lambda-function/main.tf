resource "aws_lambda_function" "lambda" {
  function_name = "${var.stage}-superbowleto-${var.name}"
  handler = "${var.handler}"
  filename = "${path.module}/lambda.zip"

  role = "${var.role}"
  memory_size = "${var.memory_size}"
  runtime = "${var.runtime}"
  timeout = "${var.timeout}"

  tags {
    Stage = "${var.stage}"
  }

  vpc_config {
    subnet_ids = ["${var.subnet_ids}"]
    security_group_ids = ["${var.security_group_ids}"]
  }

  environment {
    variables = "${var.environment_variables}"
  }
}
