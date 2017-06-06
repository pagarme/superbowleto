data "aws_iam_policy_document" "sqs_policy_document" {
  statement {
    effect = "Allow"

    actions = [
      "sqs:ChangeMessageVisibility",
      "sqs:DeleteMessage",
      "sqs:ReceiveMessage",
      "sqs:SendMessage"
    ]

    resources = [
      "${var.sqs_queue_arns}"
    ]
  }
}

resource "aws_iam_policy" "sqs_policy" {
  name = "lambda_sqs_policy"
  policy = "${data.aws_iam_policy_document.sqs_policy_document.json}"
}

resource "aws_iam_policy_attachment" "lambda_sqs_policy_attachment" {
  name = "lambda_sqs_policy_attachment"
  policy_arn = "${aws_iam_policy.sqs_policy.arn}"

  roles = [
    "${aws_iam_role.lambda_execution_role.name}"
  ]
}
