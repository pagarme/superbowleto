output "queues_arns" {
  value = [
    "${aws_sqs_queue.boletos_to_register_queue.arn}"
  ]
}
