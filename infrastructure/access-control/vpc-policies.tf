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
  name = "${var.stage}-superbowleto-lambda-vpc-access"
  description = "Allow Lambdas to be used within a VPC"
  policy = "${data.aws_iam_policy_document.vpc.json}"
}

resource "aws_iam_policy_attachment" "vpc" {
  name = "${var.stage}-superbowleto-lambda-vpc-access"
  policy_arn = "${aws_iam_policy.vpc.arn}"

  roles = [
    "${aws_iam_role.lambda_execution_role.name}"
  ]
}
