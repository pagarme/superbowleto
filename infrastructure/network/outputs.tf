output "vpc_id" {
  value = "${aws_vpc.vpc.id}"
}

output "dmz_security_group_id" {
  value = "${aws_security_group.dmz.id}"
}

output "dmz_subnet_ids" {
  value = ["${aws_subnet.dmz.*.id}"]
}

output "lambda_security_group_id" {
  value = "${aws_security_group.lambda.id}"
}

output "lambda_subnet_ids" {
  value = ["${aws_subnet.lambda.*.id}"]
}

output "database_security_group_id" {
  value = "${aws_security_group.database.id}"
}

output "database_subnet_ids" {
  value = ["${aws_subnet.database.*.id}"]
}

