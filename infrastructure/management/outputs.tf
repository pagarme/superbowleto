output "credstash_secret_writer_policy_arn" {
  value = "${aws_iam_policy.secret_writer.arn}"
}

output "credstash_secret_reader_policy_arn" {
  value = "${aws_iam_policy.secret_reader.arn}"
}
