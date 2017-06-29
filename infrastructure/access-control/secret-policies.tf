resource "aws_iam_policy_attachment" "secret_read" {
  name = "${var.stage}-${var.project}-lambda-secret-read"
  policy_arn = "${var.credstash_secret_reader_policy_arn}"

  roles = [
    "${aws_iam_role.lambda_execution_role.name}"
  ]
}
