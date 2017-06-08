data "aws_iam_policy_document" "lambda_assume_role_policy_document" {
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
  name = "lambda_execution_role"
  assume_role_policy = "${data.aws_iam_policy_document.lambda_assume_role_policy_document.json}"
}

resource "aws_iam_policy_attachment" "secret_reader" {
  name = "secret_reader"
  policy_arn = "${var.credstash_secret_reader_policy_arn}"

  roles = [
    "${aws_iam_role.lambda_execution_role.name}"
  ]
}
