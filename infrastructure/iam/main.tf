data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    actions = [
      "sts:AssumeRole"
    ]

    principals = {
      type = "Service"
      identifiers = [
        "lambda.amazonaws.com"
      ]
    }
  }
}

resource "aws_iam_role" "lambda_execution_role" {
  name = "LambdaExecutionRole"
  assume_role_policy = "${data.aws_iam_policy_document.lambda_assume_role.json}"
}

resource "aws_iam_policy_attachment" "secret_reader" {
  name = "secret_reader"
  policy_arn = "${var.credstash_secret_reader_policy_arn}"

  roles = [
    "${aws_iam_role.lambda_execution_role.name}"
  ]
}

resource "aws_iam_policy_attachment" "vpc_eni" {
  name = "lambda_eni_policy_attachment"
  policy_arn = "${aws_iam_policy.vpc_eni.arn}"

  roles = [
    "${aws_iam_role.lambda_execution_role.name}"
  ]
}

resource "aws_iam_policy_attachment" "logs" {
  name = "lambda_logs_policy_attachment"
  policy_arn = "${aws_iam_policy.logs.arn}"

  roles = [
    "${aws_iam_role.lambda_execution_role.name}"
  ]
}

resource "aws_iam_policy_attachment" "sqs" {
  name = "lambda_sqs_policy_attachment"
  policy_arn = "${aws_iam_policy.sqs.arn}"

  roles = [
    "${aws_iam_role.lambda_execution_role.name}"
  ]
}
