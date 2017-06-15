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
      "*"
    ]
  }
}

resource "aws_iam_policy" "sqs" {
  name = "LambdaSQS"
  policy = "${data.aws_iam_policy_document.sqs.json}"
}
