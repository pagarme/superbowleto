resource "aws_s3_bucket" "deploy_bucket" {
  bucket = "superbowleto-deploy-xc18"

  tags {
    Name = "superbowleto Deploy Bucket"
  }
}
