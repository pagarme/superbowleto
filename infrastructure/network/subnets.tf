resource "aws_subnet" "dmz" {
  count = "${length(var.az_list)}"
  vpc_id = "${aws_vpc.vpc.id}"
  cidr_block = "${cidrsubnet(var.vpc_cidr, 5, count.index + 0)}"
  map_public_ip_on_launch = true
  availability_zone = "${element(var.az_list, count.index)}"

  tags {
    Name = "superbowleto DMZ Subnet - AZ ${element(var.az_list, count.index)}"
    Public = "true"
  }
}

resource "aws_subnet" "lambda" {
  count = "${length(var.az_list)}"
  vpc_id = "${aws_vpc.vpc.id}"
  cidr_block = "${cidrsubnet(var.vpc_cidr, 5, count.index + 5)}"
  map_public_ip_on_launch = false
  availability_zone = "${element(var.az_list, count.index)}"

  tags {
    Name = "superbowleto Lambda Subnet - AZ ${element(var.az_list, count.index)}"
    Public = "false"
  }
}

resource "aws_subnet" "database" {
  count = "${length(var.az_list)}"
  vpc_id = "${aws_vpc.vpc.id}"
  cidr_block = "${cidrsubnet(var.vpc_cidr, 5, count.index + 10)}"
  map_public_ip_on_launch = false
  availability_zone = "${element(var.az_list, count.index)}"

  tags {
    Name = "superbowleto Database Subnet - AZ ${element(var.az_list, count.index)}"
    Public = "true"
  }
}

resource "aws_db_subnet_group" "database" {
  name = "superbowleto_database_subnet_group"
  description = "superbowleto Database Subnet Group"
  subnet_ids = ["${aws_subnet.database.*.id}"]

  tags {
    Name = "superbowleto Database Subnet Group"
  }
}
