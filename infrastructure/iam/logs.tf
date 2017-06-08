data "aws_iam_policy_document" "logs" {
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

resource "aws_iam_policy" "logs" {
  name = "LambdaLogs"
  policy = "${data.aws_iam_policy_document.logs.json}"
}
