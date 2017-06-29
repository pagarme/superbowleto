data "aws_iam_policy_document" "sqs" {
  statement {
    effect = "Allow"

    actions = [
      "sqs:ChangeMessageVisibility",
      "sqs:DeleteMessage",
      "sqs:ReceiveMessage",
      "sqs:SendMessage"
    ]

    resources = [
      "${aws_sqs_queue.boletos_to_register.arn}"
    ]
  }
}

resource "aws_iam_policy" "sqs" {
  name = "${var.stage}-superbowleto-lambda-sqs"
  description = "Allow Lambdas to use superbowleto queues"
  policy = "${data.aws_iam_policy_document.sqs.json}"
}

resource "aws_iam_policy_attachment" "sqs" {
  name = "${var.stage}-superbowleto-lambda-sqs"
  policy_arn = "${aws_iam_policy.sqs.arn}"

  roles = [
    "${var.lambda_execution_role_name}"
  ]
}
