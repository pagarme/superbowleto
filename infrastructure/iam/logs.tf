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
  name = "superbowleto_logs_policy"
  policy = "${data.aws_iam_policy_document.logs_policy_document.json}"
}

resource "aws_iam_policy_attachment" "logs_policy_attachment" {
  name = "superbowleto_logs_policy_attachment"
  roles = ["${aws_iam_role.superbowleto_lambda_role.name}"]
  policy_arn = "${aws_iam_policy.logs_policy.arn}"
}

