resource "aws_db_subnet_group" "database_subnet_group" {
  name = "superbowleto_database_subnet_group"
  description = "Superbowleto Database Subnet Group"
  subnet_ids = ["${var.database_subnet_ids}"]

  tags {
    Name = "Superbowleto Database Subnet Group"
  }
}

resource "aws_db_instance" "database" {
  allocated_storage = 10
  storage_type = "gp2"
  instance_class = "db.t2.micro"
  engine = "postgres"
  engine_version = "9.6.2"

  name = "superbowleto"
  identifier = "superbowleto"
  username = "superbowleto"
  password = "touchdown1!"

  backup_retention_period = 7
  multi_az = true
  apply_immediately = true
  skip_final_snapshot = true
  db_subnet_group_name = "${aws_db_subnet_group.database_subnet_group.name}"
  vpc_security_group_ids = ["${var.database_security_group_id}"]

  tags {
    Name = "Superbowleto Database"
  }
}
