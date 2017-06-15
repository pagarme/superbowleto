output "boletos_to_register_queue_arn" {
  value = "${aws_sqs_queue.boletos_to_register.arn}"
}

output "boletos_to_register_queue_url" {
  value = "https://sqs.us-east-1.amazonaws.com/745715572008/${aws_sqs_queue.boletos_to_register.name}"
}
