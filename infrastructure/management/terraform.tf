resource "aws_s3_bucket" "terraform_statelock" {
  bucket = "terraform-state-superbowleto-infrastructure-lock"

  versioning {
    enabled = true
  }
}

resource "aws_dynamodb_table" "terraform_statelock" {
  name = "terraform-state-superbowleto-infrastructure-lock"
  read_capacity = 5
  write_capacity = 5
  hash_key = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}
