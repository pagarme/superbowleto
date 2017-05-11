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
  multi_az = false
  apply_immediately = true
  skip_final_snapshot = true
}
