resource "aws_db_instance" "database" {
  engine = "postgres"
  engine_version = "9.6.2"
  name = "${var.stage}_superbowleto"
  identifier = "${var.stage}-superbowleto"

  instance_class = "db.t2.medium"
  storage_type = "gp2"
  allocated_storage = "12"

  username = "superbowleto"
  password = "touchdown1!"
  publicly_accessible = false

  auto_minor_version_upgrade = true
  backup_retention_period = "30"
  backup_window = "04:00-04:30"
  copy_tags_to_snapshot = true
  final_snapshot_identifier = "${var.stage}-superbowleto"
  maintenance_window = "sun:04:30-sun:05:30"
  skip_final_snapshot = false

  db_subnet_group_name = "${var.database_subnet_group_name}"
  multi_az = true
  port = "5432"
  vpc_security_group_ids = ["${var.database_security_group_ids}"]

  tags {
    Name = "Superbowleto Database"
    Stage = "${var.stage}"
  }
}
