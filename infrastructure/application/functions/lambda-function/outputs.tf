output "function_name" {
  value = "${aws_lambda_function.lambda.function_name}"
}

output "invoke_arn" {
  value = "${aws_lambda_function.lambda.invoke_arn}"
}

output "function_arn" {
  value = "${aws_lambda_function.lambda.arn}"
}
