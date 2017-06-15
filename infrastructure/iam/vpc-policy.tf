data "aws_iam_policy_document" "vpc" {
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

resource "aws_iam_policy" "vpc" {
  name = "SuperbowletoLambdaVPCAccess"
  description = "Allow Lambdas to be used within a VPC"
  policy = "${data.aws_iam_policy_document.vpc.json}"
}
