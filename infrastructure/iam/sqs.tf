data "aws_iam_policy_document" "sqs_policy_document" {
  statement {
    effect = "Allow"

    actions = [
      "sqs:*"
    ]

    resources = ["${var.sqs_queues_arns}"]
  }
}

resource "aws_iam_policy" "sqs_policy" {
  name = "superbowleto_sqs_policy"
  policy = "${data.aws_iam_policy_document.sqs_policy_document.json}"
}

resource "aws_iam_policy_attachment" "sqs_policy_attachment" {
  name = "superbowleto_sqs_policy_attachment"
  roles = ["${aws_iam_role.superbowleto_lambda_role.name}"]
  policy_arn = "${aws_iam_policy.sqs_policy.arn}"
}

