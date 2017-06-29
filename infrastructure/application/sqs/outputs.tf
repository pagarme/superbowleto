output "boletos_to_register_queue_url" {
  value = "https://sqs.${var.region}.amazonaws.com/${var.account_id}/${aws_sqs_queue.boletos_to_register.name}"
}
