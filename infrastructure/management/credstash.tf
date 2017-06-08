resource "aws_kms_key" "credstash" {
  description = "Credstash"
  deletion_window_in_days = 10
}

resource "aws_kms_alias" "credstash" {
  name = "alias/credstash"
  target_key_id = "${aws_kms_key.credstash.key_id}"
}

resource "aws_dynamodb_table" "credstash" {
  name = "credential-store"
  read_capacity = 1
  write_capacity = 1

  hash_key = "name"
  range_key = "version"

  attribute {
    name = "name"
    type = "S"
  }

  attribute {
    name = "version"
    type = "S"
  }
}

data "aws_iam_policy_document" "secret_reader" {
  statement {
    effect = "Allow"

    actions = [
      "kms:Decrypt"
    ]

    resources = [
      "${aws_kms_key.credstash.arn}"
    ]
  }

  statement {
    effect = "Allow"

    actions = [
      "dynamodb:GetItem",
      "dynamodb:Query",
      "dynamodb:Scan"
    ]

    resources = [
      "${aws_dynamodb_table.credstash.arn}"
    ]
  }
}

resource "aws_iam_policy" "secret_reader" {
  name = "CredstashSecretRead"
  policy = "${data.aws_iam_policy_document.secret_reader.json}"
}

data "aws_iam_policy_document" "secret_writer" {
  statement {
    effect = "Allow"

    actions = [
      "kms:GenerateDataKey"
    ]

    resources = [
      "${aws_kms_key.credstash.arn}"
    ]
  }

  statement {
    effect = "Allow"

    actions = [
      "dynamodb:PutItem"
    ]

    resources = [
      "${aws_dynamodb_table.credstash.arn}"
    ]
  }
}

resource "aws_iam_policy" "secret_writer" {
  name = "CredstashSecretWrite"
  policy = "${data.aws_iam_policy_document.secret_writer.json}"
}
