output "endpoint" {
  value = "${aws_db_instance.database.endpoint}"
}

output "name" {
  value = "${aws_db_instance.database.name}"
}

output "username" {
  value = "${aws_db_instance.database.username}"
}


