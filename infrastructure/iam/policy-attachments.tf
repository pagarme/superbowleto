resource "aws_iam_policy_attachment" "secret_reader" {
  name = "superbowleto-lambda-secret-read-attachment"
  policy_arn = "${var.credstash_secret_reader_policy_arn}"

  roles = [
    "${aws_iam_role.lambda_execution_role.name}"
  ]
}

resource "aws_iam_policy_attachment" "vpc" {
  name = "superbowleto-lambda-vpc-attachment"
  policy_arn = "${aws_iam_policy.vpc.arn}"

  roles = [
    "${aws_iam_role.lambda_execution_role.name}"
  ]
}

resource "aws_iam_policy_attachment" "logs" {
  name = "superbowleto-lambda-logs-attachment"
  policy_arn = "${aws_iam_policy.logs.arn}"

  roles = [
    "${aws_iam_role.lambda_execution_role.name}"
  ]
}
