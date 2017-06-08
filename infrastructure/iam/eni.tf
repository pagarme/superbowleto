data "aws_iam_policy_document" "vpc_eni" {
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

resource "aws_iam_policy" "vpc_eni" {
  name = "LambdaVPC"
  policy = "${data.aws_iam_policy_document.vpc_eni.json}"
}
