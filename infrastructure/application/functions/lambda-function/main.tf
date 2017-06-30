resource "aws_lambda_function" "lambda" {
  function_name = "${var.stage}-superbowleto-${var.name}"
  handler = "${var.handler}"

  role = "${var.role}"
  memory_size = "${var.memory_size}"
  runtime = "${var.runtime}"
  timeout = "${var.timeout}"

  filename = "${path.module}/lambda.zip"
  source_code_hash = "${data.archive_file.lambda_zip.output_base64sha256}"
  source_code_hash = "${base64sha256(file("${path.module}/lambda.zip"))}"

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
