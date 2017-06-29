output "lambda_execution_role_arn" {
  value = "${aws_iam_role.lambda_execution_role.arn}"
}

output "lambda_execution_role_name" {
  value = "${aws_iam_role.lambda_execution_role.name}"
}
