data "aws_iam_policy_document" "eni_policy_document" {
  statement {
    effect = "Allow"

    actions = [
      "ec2:CreateNetworkInterface",
      "ec2:DescribeNetworkInterfaces",
      "ec2:DeleteNetworkInterface"
    ]

    resources = [
      "*"
    ]
  }
}

resource "aws_iam_policy" "eni_policy" {
  name = "lambda_eni_policy"
  policy = "${data.aws_iam_policy_document.eni_policy_document.json}"
}

resource "aws_iam_policy_attachment" "eni_policy_attachment" {
  name = "lambda_eni_policy_attachment"
  policy_arn = "${aws_iam_policy.eni_policy.arn}"

  roles = [
    "${aws_iam_role.lambda_execution_role.name}"
  ]
}
