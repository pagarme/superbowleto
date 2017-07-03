data "aws_iam_policy_document" "logs" {
  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]

    resources = [
      "*"
    ]
  }
}

resource "aws_iam_policy" "logs" {
  name = "${var.stage}-superbowleto-lambda-logs"
  description = "Allow Lambdas to create and write to CloudWatch logs"
  policy = "${data.aws_iam_policy_document.logs.json}"
}

resource "aws_iam_policy_attachment" "logs" {
  name = "${var.stage}-superbowleto-lambda-logs"
  policy_arn = "${aws_iam_policy.logs.arn}"

  roles = [
    "${aws_iam_role.lambda_execution_role.name}"
  ]
}
