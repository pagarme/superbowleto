output "endpoint" {
  value = "${aws_db_instance.database.endpoint}"
}

output "username" {
  value = "${aws_db_instance.database.username}"
}
