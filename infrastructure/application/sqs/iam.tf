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
  name = "SuperbowletoLambdaSQS"
  description = "Allow Lambdas to use Superbowleto queues"
  policy = "${data.aws_iam_policy_document.sqs.json}"
}

resource "aws_iam_policy_attachment" "sqs" {
  name = "superbowleto-lambda-sqs-attachment"
  policy_arn = "${aws_iam_policy.sqs.arn}"

  roles = [
    "${var.lambda_execution_role_name}"
  ]
}
