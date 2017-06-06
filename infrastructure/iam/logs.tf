data "aws_iam_policy_document" "logs_policy_document" {
  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]

    resources = [
      "*"
    ]
  }
}

resource "aws_iam_policy" "logs_policy" {
  name = "lambda_logs_policy"
  policy = "${data.aws_iam_policy_document.logs_policy_document.json}"
}

resource "aws_iam_policy_attachment" "logs_policy_attachment" {
  name = "lambda_logs_policy_attachment"
  policy_arn = "${aws_iam_policy.logs_policy.arn}"

  roles = [
    "${aws_iam_role.lambda_execution_role.name}"
  ]
}
