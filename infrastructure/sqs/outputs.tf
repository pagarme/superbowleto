output "sqs_queue_arns" {
  value = [
    "${aws_sqs_queue.boletos_to_register.arn}"
  ]
}
