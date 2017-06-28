resource "aws_vpc" "vpc" {
  cidr_block = "${var.vpc_cidr}"
  enable_dns_support = true
  enable_dns_hostnames = true

  tags {
    Name = "superbowleto VPC"
  }
}

resource "aws_internet_gateway" "internet_gateway" {
  vpc_id = "${aws_vpc.vpc.id}"

  tags {
    Name = "superbowleto Internet Gateway"
  }
}

resource "aws_eip" "nat_gateway" {
  vpc = true
}

resource "aws_nat_gateway" "nat_gateway" {
  subnet_id = "${aws_subnet.dmz.0.id}"
  allocation_id = "${aws_eip.nat_gateway.id}"
  depends_on = ["aws_internet_gateway.internet_gateway"]
}
